import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import LoadingSpinner from "../LoadingSpinner";
import { CONFIG } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Register() {
   const API_URL = CONFIG.API_URL;
   const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [fieldErrors, setFieldErrors] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmitOnRegistration = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         toast.error("Passwords don't match!");
         return;
      }

      setIsLoading(true);
      setFieldErrors({
         username: "",
         email: "",
         password: "",
         confirmPassword: "",
      });

      try {
         console.log("Sending request to:", `${API_URL}/users/initiate-registration`);
         const response = await fetch(`${API_URL}/users/initiate-registration`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               username: formData.username,
               email: formData.email,
               password: formData.password,
            }),
         });

         const data = await response.json();
         console.log("Server response:", data);

         if (response.ok) {
            console.log("Validation successful, proceeding to two-factor auth");
            navigate("/two-factor-auth", {
               state: { email: formData.email, isRegistration: true, username: formData.username, password: formData.password },
            });
         } else {
            if (data.field && data.message) {
               setFieldErrors((prevErrors) => ({ ...prevErrors, [data.field]: data.message }));
               // toast.error(data.message);
            } else if (data.message) {
               toast.error(data.message);
            } else {
               toast.error("Registration initiation failed");
            }
         }
      } catch (error) {
         console.error("Registration initiation error:", error);
         toast.error("An error occurred during registration initiation. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   if (isLoading) {
      return <LoadingSpinner />;
   }

   return (
      <div className={styles.registerContainer}>
         <div className={styles.registerForm}>
            <div className={styles.formContent}>
               <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faGraduationCap} className={styles.userIcon} />
               </div>
               <h2>Join LearnHub Today</h2>
               <form onSubmit={handleSubmitOnRegistration}>
                  <div className={`${styles.inputGroup} ${fieldErrors.username ? styles.hasError : ""}`}>
                     <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                     <input
                        type='text'
                        name='username'
                        placeholder='Username'
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete='username'
                     />
                     {fieldErrors.username && <span className={styles.errorMessage}>{fieldErrors.username}</span>}
                  </div>
                  <div className={`${styles.inputGroup} ${fieldErrors.email ? styles.hasError : ""}`}>
                     <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                     <input
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete='email'
                     />
                     {fieldErrors.email && <span className={styles.errorMessage}>{fieldErrors.email}</span>}
                  </div>
                  <div className={styles.inputGroup}>
                     <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                     <input
                        type={showPassword ? "text" : "password"}
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete='new-password'
                     />
                     <button type='button' className={styles.showPasswordButton} onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                     </button>
                  </div>
                  <div className={styles.inputGroup}>
                     <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                     <input
                        type={showConfirmPassword ? "text" : "password"}
                        name='confirmPassword'
                        placeholder='Confirm Password'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete='new-password'
                     />
                     <button
                        type='button'
                        className={styles.showPasswordButton}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                     </button>
                  </div>
                  <button type='submit'>Register</button>
               </form>
               <p>
                  Already have an account? <Link to='/login'>Login here</Link>
               </p>
            </div>
            <div className={styles.appDescription}>
               <h3>Why Join LearnHub?</h3>
               <ul>
                  <li>Track progress across learning materials</li>
                  <li>Set and achieve educational goals</li>
                  <li>Connect with like-minded learners</li>
                  <li>Access curated learning resources</li>
                  <li>Get personalized recommendations</li>
               </ul>
               <p>Start your journey towards continuous learning and personal growth!</p>
            </div>
         </div>
      </div>
   );
}

export default Register;
