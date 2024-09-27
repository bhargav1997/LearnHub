import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
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

   const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         alert("Passwords don't match!");
         return;
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some((user) => user.email === formData.email)) {
         alert("User with this email already exists!");
         return;
      }

      // Add new user
      users.push({
         username: formData.username,
         email: formData.email,
         password: formData.password, // In a real app, never store passwords in plain text
      });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registration successful! Please log in.");
      navigate("/login");
   };

   return (
      <div className={styles.registerContainer}>
         <div className={styles.registerForm}>
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
               <input type='text' name='username' placeholder='Username' value={formData.username} onChange={handleChange} required />
               <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
               <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />
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
