// src/components/Login.jsx
import React, { useState } from "react";
import { login, register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate  = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isRegister) {
        const response =await register(
          {
            username,
            password,
            role: "Learner"
          }
        )
        console.log(response)
        setMessage("✅ Registration successful! Please log in.");
        setIsRegister(false);
      } else {
        const response = await login(
          {
            username,
            password,
            role:"Admin"
          }
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/");
      }
    } catch (error) {
      console.log(error)
      setMessage("❌ " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>

      <p className="toggle-text">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Register"}
        </span>
      </p>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
