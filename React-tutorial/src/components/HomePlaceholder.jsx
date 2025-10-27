import React from "react";
import { motion } from "framer-motion";
import homeAvatar from "../assets/home_avatar.jpg";
import "../styles/HomePlaceholder.css";

export default function HomePlaceholder({ onCreate }) {
  return (
    <div className="container" >
      <motion.img
        src={homeAvatar}
        alt="Create Form"
        className="home-avatar"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <h2>Create a Form Template</h2>
      <p>Create templates that can be used in various other features.</p>
      <button className="create-button" onClick={onCreate}>Create Form</button>
    </div>
  );
}
