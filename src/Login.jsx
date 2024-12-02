import React, { useState } from "react";
import Footer from "../src/components/footer";
import Nav from "../src/components/nav";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Login() {
  const [user_id, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("Student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Enhanced input validation
    if (!user_id || !password || !organization) {
      setError("Please fill in all fields");
      return;
    }

    const storedUser = localStorage.getItem("user_" + user_id);
    
    if (!storedUser) {
      setError(`No ${organization} account found with this ID. Please register first.`);
      return;
    }

    const userDetails = JSON.parse(storedUser);

    // Role-based validation
    if (userDetails.organization !== organization) {
      setError(`This ID belongs to a ${userDetails.organization}, not a ${organization}. Please select the correct role.`);
      return;
    }

    if (userDetails.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // Success handling
    setSuccess(true);
    setError(""); // Clear any previous errors
    
    // Store user session data
    localStorage.setItem("last_user_id", user_id);
    localStorage.setItem("organization", userDetails.organization);
    localStorage.setItem("user_id", user_id);

    // Role-based redirection with delay
    setTimeout(() => {
      switch(organization) {
        case "Driver":
          navigate("/triphistory");
          break;
        case "Student":
        case "Employee":
          navigate("/agreement");
          break;
        default:
          setError("Invalid role selected");
          setSuccess(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen font-sans">
      <Nav />
      {success && (
        <div className="check-icon">
          <i className="fas fa-check-circle"></i>
          <span>Login Successful!</span>
        </div>
      )}
      <div className="main-container md:flex-row sm:flex-col">
        <div className="text-section md:w-1/2 sm:w-full sm:text-center md:text-left">
          <h1 className="large-text md:text-5xl sm:text-4xl">Libre Sakay,</h1>
          <h2 className="medium-text md:text-3xl sm:text-2xl">Later na magbugsay</h2>
        </div>
        <div className="login-container md:w-1/2 sm:w-full">
          <form className="login-form md:w-3/4 sm:w-full" onSubmit={handleLogin}>
            <input
              type="text"
              className="md:w-4/5 sm:w-full"
              placeholder="Enter ID Number"
              value={user_id}
              onChange={(e) => setUserID(e.target.value)}
              required
            />
            <input
              type="password"
              className="md:w-4/5 sm:w-full"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              className="md:w-4/5 sm:w-full"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
            >
              <option value="Student">Student</option>
              <option value="Employee">Employee</option>
              <option value="Driver">Driver</option>
            </select>
            <button type="submit" className="md:w-2/5 sm:w-3/4">Log In</button>
            {error && <p className="error-message">{error}</p>}
            <p className="register-link">
              Don't have an account yet? <a href="/register">Register</a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
