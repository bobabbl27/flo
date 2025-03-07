import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../components/signup";
import VerifyEmail from "../components/veifyemail";
import EmailVerified from "../components/emailverified";
import CompleteRegistration from "../components/CompleteRegistration"; 
import Home from "../pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/complete-registration" element={<CompleteRegistration />} /> {/* Link to Complete Registration */}
        <Route path="/home" element={<Home />} /> 
      </Routes>
    </Router>
  );
}

export default App;
