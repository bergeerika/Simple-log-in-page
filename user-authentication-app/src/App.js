import React, { useState, useEffect } from "react";
import axios from "axios"
import './App.css'

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] =useState(false);

  const handleRegister = () => {
    axios
      .post("http://localhost:5000/register", { username, password })
      .then((response) => {
        if (response.status === 201) {
          setRegistrationSuccess(true);
          setUsername("");
          setPassword("");
        }
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setRegistrationError("User already exists");
        } else {
          setRegistrationError("An error occurred during registration");
        }
      });
  };

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/login", { username, password })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setLoggedIn(true);
        console.log("Login successful");
      })
      .catch((error) => console.error(error));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  // useEffect to clear the input fields and registration success message after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setRegistrationSuccess(false);
      setUsername("");
      setPassword("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [registrationSuccess]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRegistrationError(false);
      setUsername("");
      setPassword("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [registrationError]);

  if (loggedIn) {
    return (
      <div>
        <h1>Hello {username}</h1>
        <button class="button button1" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      <body>
        <h1>Login</h1>
        {registrationSuccess && <p>Registration successful!</p>}
        {registrationError && <p>{registrationError}</p>}
        <div class="login">
          <label>
            <b>User Name</b>
          </label>

          <br></br>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <br></br>

          <label>
            <b>Password</b>
          </label>

          <br></br>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>

          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      </body>
    </div>
  );
}

export default App;
