import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import LoadingSpinner from "../LoadingSpinner";

function Register() {
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const navigate = useNavigate();

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

      try {
         const response = await fetch("http://localhost:5073/api/users/register", {
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
            console.log("Registration successful:", data);
            alert("Registration successful! Please log in.");
            navigate("/login");
         } else {
            console.error("Registration failed:", data);
            alert(data.message || "Registration failed");
         }
      } catch (error) {
         console.error("Registration error:", error);
         alert("An error occurred during registration");
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
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
               <input
                  type='text'
                  name='username'
                  placeholder='Username'
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete='on'
               />
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
               <input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
               />
               <button type='submit'>Register</button>
            </form>
            <p>
               Already have an account? <Link to='/login'>Login here</Link>
            </p>
         </div>
      </div>
   );
}

export default Register;
