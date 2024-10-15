import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/user/userSlice";
import styles from "./Register.module.css";
import LoadingSpinner from "../LoadingSpinner";
// import TwoFactorAuth from "../TwoFactorAuth/TwoFactorAuth";
import { CONFIG } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

function Register() {
   const API_URL = CONFIG.API_URL;
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         alert("Passwords don't match!");
         return;
      }

      setIsLoading(true);
      dispatch(setLoading(true));

      try {
         const response = await fetch(`${API_URL}/users/register`, {
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

         if (response.ok) {
            if (data.requireTwoFactor) {
               navigate("/two-factor-auth", {
                  state: {
                     email: formData.email,
                     isRegistration: true,
                  },
               });
            } else {
               alert("Registration successful! Please log in.");
               navigate("/login");
            }
         } else {
            console.error("Registration failed:", data);
            alert(data.message || "Registration failed");
         }
      } catch (error) {
         console.error("Registration error:", error);
         alert("An error occurred during registration");
      } finally {
         setIsLoading(false);
         dispatch(setLoading(false));
      }
   };

   if (isLoading) {
      return <LoadingSpinner />;
   }

   // if (showTwoFactor) {
   //    return <TwoFactorAuth email={formData.email} isRegistration={true} />;
   // }

   return (
      <div className={styles.registerContainer}>
         <div className={styles.registerForm}>
            <div className={styles.formContent}>
               <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faGraduationCap} className={styles.userIcon} />
               </div>
               <h2>Join LearnHub Today</h2>
               <form onSubmit={handleSubmit}>
                  <div className={styles.inputGroup}>
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
                  </div>
                  <div className={styles.inputGroup}>
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
                     <button type='button' className={styles.showPasswordButton} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
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
