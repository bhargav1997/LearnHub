import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/user/userSlice";
import styles from "./Login.module.css";
// import TwoFactorAuth from "../TwoFactorAuth/TwoFactorAuth";
import { toast } from "react-toastify";
import { CONFIG } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
   const API_URL = CONFIG.API_URL;
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });
   const [showPassword, setShowPassword] = useState(false);
   const user = useSelector((state) => state.user);

   // const [showTwoFactor, setShowTwoFactor] = useState(false);

   const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      if (user) {
         navigate("/");
      }
   }, [user, navigate]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(setLoading(true));

      try {
         const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         const data = await response.json();

         if (response.ok) {
            if (data.requireTwoFactor) {
               navigate("/two-factor-auth", { state: { email: formData.email } });
            } else {
               handleSuccessfulLogin(data);
            }
         } else {
            toast.error(data.message || "Login failed");
         }
      } catch (error) {
         console.error("Login error:", error);
         toast.error("An error occurred during login");
      } finally {
         dispatch(setLoading(false));
      }
   };

   const handleSuccessfulLogin = (data) => {
      try {
         localStorage.setItem("token", data.token);
         dispatch(setUser(data.user));
         toast.success("Login successful!");
      } catch (error) {
         console.error("Error handling successful login:", error);
         toast.error("An error occurred while processing your login");
      }
   };

   const handleChange = (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
   };

   // console.log("showTwoFactor", showTwoFactor);

   // if (showTwoFactor) {
   //    return <TwoFactorAuth email={formData.email} />;
   // }

   return (
      <div className={styles.loginContainer}>
         <div className={styles.loginForm}>
            <div className={styles.iconContainer}>
               <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
            </div>
            <h2>Login to Your Account</h2>
            <form onSubmit={handleSubmit}>
               <div className={styles.inputGroup}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                  <input
                     type="email"
                     name="email"
                     placeholder="Email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                     autoComplete="email"
                  />
               </div>
               <div className={styles.inputGroup}>
                  <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                  <input
                     type={showPassword ? "text" : "password"}
                     name="password"
                     placeholder="Password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                     autoComplete="current-password"
                  />
                  <button
                     type="button"
                     className={styles.showPasswordButton}
                     onClick={() => setShowPassword(!showPassword)}
                  >
                     <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
               </div>
               <div className={styles.rememberMe}>
                  <input
                     type="checkbox"
                     name="rememberMe"
                     id="rememberMe"
                     checked={formData.rememberMe}
                     onChange={handleChange}
                  />
                  <label htmlFor="rememberMe">Remember Me</label>
               </div>
               <button type="submit">Login</button>
            </form>
            <p>
               {"Don't have an account? "} <Link to='/register'>Register here</Link>
            </p>
         </div>
      </div>
   );
}

export default Login;
