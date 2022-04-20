import React, { ChangeEvent, FormEvent, useState } from "react";
import "./Login.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser } from "../../features/user/userSlice";

function Login() {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e: FormEvent) => {
    e.preventDefault();
    fetch("https://applmsbe.herokuapp.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: "include",
    })
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        } else {
          throw new Error("Wrong password or username");
        }
      })
      .then((r) => {
        dispatch(loginUser(r));
      });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="Login">
      <div className="app-lms-login">
        <h1>Sign in</h1>
        <form onSubmit={login}>
          <div className="app-lms-login-form">
            <span>YOUR EMAIL</span>
            <input
              onChange={handleEmailChange}
              autoComplete="username"
              name="email"
              placeholder="Your email address"
              required={true}
            ></input>
          </div>
          <div className="app-lms-login-form">
            <span>YOUR PASSWORD</span>
            <input
              onChange={handlePasswordChange}
              autoComplete="current-password"
              type="password"
              name="password"
              placeholder="Your password"
              required={true}
            ></input>
          </div>
          <button type="submit">Let's go</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
