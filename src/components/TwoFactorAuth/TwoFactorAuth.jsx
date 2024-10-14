import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../../redux/user/userSlice";
import styles from "./TwoFactorAuth.module.css";
import { toast } from "react-toastify";
import { CONFIG } from "../../config";

function TwoFactorAuth() {
   const API_URL = CONFIG.API_URL;
   const [code, setCode] = useState("");
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const location = useLocation();
   const { email, isRegistration } = location.state || {};

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
            body: JSON.stringify({ email, code }),
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

   const handleChange = (e) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
      setCode(value);
   };

   const maskedEmail = email ? email.replace(/(.{2})(.*)(?=@)/, (_, start, rest) => start + "*".repeat(rest.length)) : "your email";

   if (!email) {
      return <div className={styles.errorMessage}>Error: Email not provided. Please go back and try again.</div>;
   }

   return (
      <div className={styles.twoFactorContainer}>
         <div className={styles.twoFactorForm}>
            <h2>Two-Factor Authentication</h2>
            <p>Enter the 6-digit code sent to {maskedEmail}</p>
            <form onSubmit={handleSubmit}>
               <input
                  type='text'
                  value={code}
                  onChange={handleChange}
                  placeholder='Enter 6-digit code'
                  required
                  maxLength={6}
                  pattern='\d{6}'
               />
               <button type='submit' disabled={code.length !== 6}>
                  Verify
               </button>
            </form>
         </div>
      </div>
   );
}

export default TwoFactorAuth;
