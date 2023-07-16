import React from "react";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import { Link, Route, Routes } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <a href="/" className="site-name">
        Akario
      </a>
      <ul>
        <li>
          <a href="/Blogs">Blogs</a>
        </li>
        <li>
          <a href="/About">Listings</a>
        </li>
        <li>
          <a href="/Contact">Contact</a>
        </li>
       
      </ul>
    </nav>
  );
}

