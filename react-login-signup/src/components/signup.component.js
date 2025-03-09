import React, { Component } from "react";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      usernameValid: false,
      usernameError: "",
      password: "",
      confirmPassword: "",
      passwordValid: false,
      passwordsMatch: true,
      passwordError: [],
      registrationSuccess: false,
    };
  }

  validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{8,}$/;
    if (!usernameRegex.test(username)) {
      return "Username must be at least 8 characters, no spaces, only letters, numbers, and '_'";
    }
    return "";
  };

  handleUsernameChange = (e) => {
    const username = e.target.value;
    const errorMessage = this.validateUsername(username);
    this.setState({
      username,
      usernameValid: errorMessage === "",
      usernameError: errorMessage,
    });
  };

  validatePassword = (password) => {
    let errors = [];
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/\W/.test(password)) errors.push("one special character");
    if (password.length < 8) errors.push("at least 8 characters");
    return errors;
  };

  handlePasswordChange = (e) => {
    const password = e.target.value;
    const errors = this.validatePassword(password);
    this.setState({
      password,
      passwordValid: errors.length === 0,
      passwordError: errors,
    });
  };

  handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    this.setState({
      confirmPassword,
      passwordsMatch: confirmPassword === this.state.password,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, passwordValid, passwordsMatch } = this.state;
    if (!passwordValid || !passwordsMatch) return;

    fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          this.setState({ registrationSuccess: true });
          setTimeout(() => {
            window.location.href = "./sign-in";
          }, 2000);
        } else {
          alert("Registration failed. " + (data.error || "Please try again."));
        }
      })
      .catch(() => alert("An error occurred. Please try again later."));
  };

  render() {
    const { password, confirmPassword, passwordValid, passwordsMatch, passwordError, usernameValid, usernameError, registrationSuccess } = this.state;

    return (
      <div>
        {registrationSuccess && (
          <div className="success-overlay">
            <div className="success-message">Successfully Registered! Redirecting...</div>
          </div>
        )}
        <form onSubmit={this.handleSubmit} className="signup-form">
          <h3>Sign Up</h3>

          <div className="mb-3">
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Enter username" onChange={this.handleUsernameChange} />
            {!usernameValid && this.state.username && <div className="text-danger">{usernameError}</div>}
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter password" onChange={this.handlePasswordChange} />
            {password && !passwordValid && (
              <div className="text-danger">Password must include: {passwordError.join(", ")}</div>
            )}
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm password" onChange={this.handleConfirmPasswordChange} />
            {!passwordsMatch && confirmPassword && <div className="text-danger">Passwords do not match</div>}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={!passwordValid || !passwordsMatch || !usernameValid}>Sign Up</button>
          </div>

          <p className="forgot-password text-right">Already registered? <a href="/sign-in">Sign in</a></p>
        </form>

        <style>{`
          .success-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 1;
            animation: fadeIn 0.5s ease-in-out;
          }

          .success-message {
            background: #4CAF50;
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            animation: popUp 0.5s ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes popUp {
            from { transform: scale(0.8); }
            to { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }
}
