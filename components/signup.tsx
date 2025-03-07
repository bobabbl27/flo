import React, { useState, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "../src/firebase";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const emailPattern = /^[a-z]+\.\d{6}@meycauayan\.sti\.edu\.ph$/;

  const passwordError = password.length > 0 && password.length < 8 ? "Password must be at least 8 characters" : "";
  const confirmPasswordError =
    confirmPassword.length > 0 && confirmPassword !== password ? "Passwords do not match" : "";


  useEffect(() => {
    if (email.length > 0) {
      if (!emailPattern.test(email)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  }, [email]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(""); 

    if (!emailPattern.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setEmailError("There is already an existing account with this email.");
        return;
      }

      // Create user if email is not taken
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      navigate("/verify-email"); 
    } catch (err: any) {
      console.error("Signup Error:", err.message);
      setEmailError("Signup failed! There is already an existing account with this email. ");
    }
  };

  return (
    <div className="d-flex container-fluid justify-content-center align-items-center" style={{ background: "#f8f9fa" }}>
      <div className="p-4 rounded shadow bg-white" style={{ width: "350px" }}>
        <h2 className="fw-bold mb-4">Sign-up</h2>
        <form onSubmit={handleSignup}>
            
          <div className="mb-3">
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              placeholder="School Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="text-danger small mt-1" style={{ minHeight: "16px" }}>{emailError}</div>
          </div>

          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-danger small mt-1">{passwordError}</div>
          </div>

          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="text-danger small mt-1">{confirmPasswordError}</div>
          </div>

          <div className="mb-3 d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={checked}
              onChange={() => setChecked(!checked)}
              required
            />
            <span className="small">
              I have read and agree to the{" "}
              <span className="text-primary fw-bold">Terms & Conditions</span>
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={!checked}>
            Signup
          </button>
        </form>

        <p className="text-center mt-3 small">
          Already have an account? <span className="text-primary fw-bold">Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
