import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../../redux/user/userSlice";
import styles from "./Login.module.css";
// import { fetchConnections } from "../../redux/user/userHandle";

function Login() {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(setLoading(true));

      try {
         const response = await fetch("http://localhost:5073/api/users/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         const data = await response.json();

         if (response.ok) {
            localStorage.setItem("token", data.token);
            dispatch(setUser(data.user));
            // dispatch(fetchConnections());
            navigate("/");
         } else {
            alert(data.message || "Login failed");
         }
      } catch (error) {
         console.error("Login error:", error);
         alert("An error occurred during login");
      } finally {
         dispatch(setLoading(false));
      }
   };

   const handleChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
   };

   return (
      <div className={styles.loginContainer}>
         <div className={styles.loginForm}>
            <h2>Login to Your Account</h2>
            <form onSubmit={handleSubmit}>
               <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete='email'
               />
               <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete='current-password'
               />
               <div className={styles.rememberMe}>
                  <input 
                     type='checkbox' 
                     name='rememberMe' 
                     id='rememberMe' 
                     checked={formData.rememberMe} 
                     onChange={handleChange} 
                  />
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
