import React from "react";
import { useState } from "react";
import { Container, TextField, Typography, Button, Link } from "@mui/material";
import { auth } from "../firebase";

const textFieldStyle = {
  marginTop: 3,
  marginBottom: 3,
  display: "block",
};

const containerStyle = {
  width: 500,
  margin: "auto",
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginState, setLoginState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (email == "") {
      setEmailError(true);
    }
    if (password == "") {
      setPasswordError(true);
    }
    if (email && password) {
      if (loginState) {
        auth
          .signInWithEmailAndPassword(email, password)
          .then((user) => {
            const form = document.querySelector(".signin-form");
            form.reset();
            setErrorMessage("");
          })
          .catch((error) => {
            setErrorMessage(error.message);
          });
      } else {
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((user) => {
            const form = document.querySelector(".signup-form");
            form.reset();
            setErrorMessage("");
          })
          .catch((error) => {
            setErrorMessage(error.message);
          });
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "75vh",
      }}
    >
      <Container size="sm" sx={containerStyle}>
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
        >
          {loginState ? "Log In with Your Account" : "Create an Account"}
        </Typography>

        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          className="signin-form"
        >
          <TextField
            sx={textFieldStyle}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={emailError}
          />
          <TextField
            sx={textFieldStyle}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            variant="outlined"
            color="secondary"
            multiline
            fullWidth
            required
            error={passwordError}
          />

          <p style={{ color: "red" }}>{errorMessage}</p>

          <Link
            style={{
              display: "block",
              marginBottom: 7,
            }}
            href="#"
            onClick={() => {
              setLoginState(!loginState);
              const form = document.querySelector(".signin-form");
              form.reset();
            }}
          >
            {loginState ? "Don't have an account?" : "Already have an account?"}
          </Link>

          <Button type="submit" color="secondary" variant="contained">
            {loginState ? "Log In" : "Sign Up"}
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default Auth;
