import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user/userSlice";
import styles from "./Login.module.css";
import LoadingSpinner from "../LoadingSpinner";

function Login() {
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });
   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
         // Verify token and get user info
         fetch("http://localhost:5073/api/users/profile", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
            .then((res) => res.json())
            .then((data) => {
               if (data.id) {
                  dispatch(setUser(data));
                  navigate("/");
               }
            })
            .catch((err) => console.error(err));
      }
   }, [dispatch, navigate]);

   const handleChange = (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const response = await fetch("http://localhost:5073/api/users/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email: formData.email,
               password: formData.password,
            }),
         });

         const data = await response.json();

         if (response.ok) {
            dispatch(setUser(data.user));
            if (formData.rememberMe) {
               localStorage.setItem("token", data.token);
            }
            navigate("/");
         } else {
            alert(data.message || "Login failed");
         }
      } catch (error) {
         console.error("Login error:", error);
         alert("An error occurred during login");
      } finally {
         setIsLoading(false);
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
               <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete='on'
               />
               <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete='on'
               />
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
