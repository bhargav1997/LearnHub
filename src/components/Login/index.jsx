import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user/userSlice";

import styles from "./Login.module.css";
import LoadingSpinner from "../LoadingSpinner";

function Login() {
   const [isLoading, setIsLoading] = useState(true);
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });
   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
      if (rememberedUser) {
         dispatch(setUser({ email: rememberedUser.email, username: rememberedUser.username }));
         navigate("/");
      }
      setIsLoading(false);
   }, [dispatch, navigate]);

   const handleChange = (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.email === formData.email && u.password === formData.password);

      if (user) {
         dispatch(setUser({ email: user.email, username: user.username }));

         if (formData.rememberMe) {
            localStorage.setItem("rememberedUser", JSON.stringify(user));
         } else {
            localStorage.removeItem("rememberedUser");
         }

         navigate("/");
      } else {
         alert("Invalid email or password");
      }
   };

   if (isLoading) {
      return <LoadingSpinner />;
   }

   return (
      <div className={styles.loginContainer}>
         <div className={styles.loginForm}>
            <h2>Login to Your Account</h2>
            <form onSubmit={handleSubmit}>
               <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
               <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />
               <div className={styles.rememberMe}>
                  <input type='checkbox' name='rememberMe' id='rememberMe' checked={formData.rememberMe} onChange={handleChange} />
                  <label htmlFor='rememberMe'>Remember Me</label>
               </div>
               <button type='submit'>Login</button>
            </form>
            <p>
               {"Don't have an account? "} <Link to='/register'>Register here</Link>
            </p>
         </div>
      </div>
   );
}

export default Login;
