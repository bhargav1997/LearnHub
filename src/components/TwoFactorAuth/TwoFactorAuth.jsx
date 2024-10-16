import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../../redux/user/userSlice";
import styles from "./TwoFactorAuth.module.css";
import { toast } from "react-toastify";
import { CONFIG } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope, faSpinner, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function TwoFactorAuth() {
   const API_URL = CONFIG.API_URL;
   const [code, setCode] = useState(["", "", "", "", "", ""]);
   const [error, setError] = useState("");
   const [cooldown, setCooldown] = useState(0);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const location = useLocation();
   const { email, isRegistration } = location.state || {};

   useEffect(() => {
      let timer;
      if (cooldown > 0) {
         timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      }
      return () => clearTimeout(timer);
   }, [cooldown]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(setLoading(true));

      try {
         const endpoint = isRegistration ? "/users/verify-2fa-registration" : "/users/verify-2fa";
         const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code: code.join("") }),
         });

         const data = await response.json();

         if (response.ok) {
            if (isRegistration) {
               toast.success("Registration successful! Please log in.");
               navigate("/login");
            } else {
               localStorage.setItem("token", data.token);
               dispatch(setUser(JSON.parse(data.user)));
               toast.success("Login successful!");
               navigate("/");
            }
         } else {
            toast.error(data.message || "Verification failed");
         }
      } catch (error) {
         console.error("Verification error:", error);
         toast.error("An error occurred during verification");
      } finally {
         dispatch(setLoading(false));
      }
   };

   const handleChange = useCallback((index, value) => {
      setCode((prevCode) => {
         const newCode = [...prevCode];
         newCode[index] = value;
         return newCode;
      });
      setError(""); // Clear any existing error when user starts typing

      // Move focus to the next input
      if (value && index < 5) {
         document.getElementById(`code-${index + 1}`).focus();
      }
   }, []);

   const requestNewCode = useCallback(async () => {
      if (cooldown > 0) return;

      try {
         await axios.post(`${API_URL}/users/resend-2fa-code`, { email });
         toast.success("New code sent. Please check your email.");
         setCooldown(60);
      } catch (error) {
         console.error("Error requesting new code:", error);
         toast.error(error.response?.data?.message || "Failed to send new code. Please try again.");
      }
   }, [API_URL, cooldown, email]);

   const maskedEmail = email ? email.replace(/(.{2})(.*)(?=@)/, (_, start, rest) => start + "*".repeat(rest.length)) : "your email";

   if (!email) {
      return <div className={styles.errorMessage}>Error: Email not provided. Please go back and try again.</div>;
   }

   return (
      <div className={styles.twoFactorContainer}>
         <div className={styles.twoFactorForm}>
            <div className={styles.iconContainer}>
               <FontAwesomeIcon icon={faLock} className={styles.lockIcon} />
            </div>
            <h2>Two-Factor Authentication</h2>
            <p>
               <FontAwesomeIcon icon={faEnvelope} className={styles.emailIcon} />
               Enter the 6-digit code sent to {maskedEmail}
            </p>
            {error && (
               <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faExclamationCircle} className={styles.errorIcon} />
                  {error}
               </div>
            )}
            <form onSubmit={handleSubmit}>
               <div className={styles.codeInputs}>
                  {code.map((digit, index) => (
                     <input
                        key={index}
                        id={`code-${index}`}
                        type='text'
                        maxLength='1'
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        required
                     />
                  ))}
               </div>
               <button type='submit' disabled={code.some((digit) => !digit)}>
                  Verify
               </button>
            </form>
            <button className={styles.requestNewCode} onClick={requestNewCode} disabled={cooldown > 0}>
               {cooldown > 0 ? (
                  <>
                     <FontAwesomeIcon icon={faSpinner} spin />
                     Resend in {cooldown}s
                  </>
               ) : (
                  "Request New Code"
               )}
            </button>
         </div>
      </div>
   );
}

export default TwoFactorAuth;
