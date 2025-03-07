import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../src/firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CompleteRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    contact: "",
    role: "",
    strandOrCourse: "",
    yearSection: "",
    userId: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email && user.email !== userEmail) {
        setUserEmail(user.email);
        const extractedId = user.email.match(/\d+/)?.[0] || "000000";
        setFormData((prev) => ({ ...prev, userId: `02000${extractedId}` }));
      }
    });
    return () => unsubscribe();
  }, [userEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && value !== "student" ? { strandOrCourse: "", yearSection: "" } : {}),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!userEmail) {
        alert("User email is not found. Please log in again.");
        return;
      }

      // Validate required fields before submission
      const requiredFields = ["firstName", "lastName", "contact", "role"];
      if (formData.role === "student") {
        requiredFields.push("strandOrCourse", "yearSection");
      }

      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData].trim()) {
          alert(`Please fill out the ${field.replace(/([A-Z])/g, " $1")}.`);
          return;
        }
      }

      const userRef = doc(db, "users", userEmail);
      await setDoc(userRef, formData, { merge: true });

      navigate("/home");
    } catch (error) {
      console.error("🔥 Firestore Error:", error);
     
    }
  };

  return (
    <div className="container">
      <div className="progress-bar">
        {[1, 2, 3].map((num) => (
          <div key={num} className={`progress-step ${step >= num ? "active" : ""}`}></div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2>Welcome to FLO</h2>
          <p>We would like to know you better, fill in the following below</p>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="First Name"
            aria-label="First Name"
          />
          <input
            type="text"
            name="middleInitial"
            value={formData.middleInitial}
            onChange={handleChange}
            placeholder="Middle Initial"
            aria-label="Middle Initial"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Last Name"
            aria-label="Last Name"
          />
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            placeholder="Contact Number"
            aria-label="Contact Number"
          />
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Role Selection</h2>
          <select name="role" value={formData.role} onChange={handleChange} required aria-label="Select Role">
            <option value="">Select Role</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Staff</option>
            <option value="student">Student</option>
          </select>

          {formData.role === "student" && (
            <>
              <select
                name="strandOrCourse"
                value={formData.strandOrCourse}
                onChange={handleChange}
                required
                aria-label="Select Strand or Course"
              >
                <option value="">Select Strand/Course</option>
                <option value="MAWD">MAWD (SHS)</option>
                <option value="ABM">ABM (SHS)</option>
                <option value="CA">CA (SHS)</option>
                <option value="STEM">STEM (SHS)</option>
                <option value="BSBAOM">BSBAOM (Tertiary)</option>
                <option value="BSTM">BSTM (Tertiary)</option>
                <option value="BSHM">BSHM (Tertiary)</option>
                <option value="BSIT">BSIT (Tertiary)</option>
                <option value="BSCPE">BSCPE (Tertiary)</option>
              </select>

              <input
                type="text"
                name="yearSection"
                value={formData.yearSection}
                onChange={handleChange}
                placeholder="Year & Section (e.g., MAWD-12A)"
                required
                aria-label="Year and Section"
              />
            </>
          )}

          <button onClick={() => setStep(1)}>Previous</button>
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Confirmation</h2>
          <p>Review your details before submitting.</p>
          <button onClick={() => setStep(2)}>Previous</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default CompleteRegistration;
