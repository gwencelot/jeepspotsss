import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Nav from "./components/nav";
import Footer from "./components/footer";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    birthday: null,
    email: "",
    password: "",
    gender: "",
    course: "",
    disability: "",
    organization: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      birthday: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.user_id ||
      !formData.name ||
      !formData.birthday ||
      !formData.email ||
      !formData.password ||
      !formData.gender ||
      !formData.organization
    ) {
      setError("Please fill in all required fields.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const userDetails = {
      user_id: formData.user_id,
      name: formData.name,
      birthday: formData.birthday,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      organization: formData.organization,
      disability: formData.disability, // Save disability information
    };

    localStorage.setItem("user_" + formData.user_id, JSON.stringify(userDetails));
    setSuccess(true);

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="main-container">
      <Nav />
      <div className="text-section">
        <h1 className="large-text">Libre Sakay,</h1>
        <h2 className="medium-text">Later na magbugsay</h2>
      </div>
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          {error && <h3 className="error-message">{error}</h3>}
          {success && <h3 className="success-message">Registration Successful!</h3>}
          <input
            type="text"
            name="user_id"
            placeholder="User ID Number"
            value={formData.user_id}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div className="date-picker-container">
            <label htmlFor="birthday" className="date-label">
              Birthday:
            </label>
            <DatePicker
              selected={formData.birthday}
              onChange={handleDateChange}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              dateFormat="MM/dd/yyyy"
              placeholderText="MM/DD/YYYY"
              id="birthday"
              name="birthday"
              className="date-input-field"
              calendarClassName="custom-calendar"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
          >
            <option value="">Select Classification</option>
            <option value="Student">Student</option>
            <option value="Employee">Employee</option>
            <option value="Driver">Driver</option>
          </select>
          <select
            name="disability"
            value={formData.disability}
            onChange={handleChange}
          >
            <option value="">Select Disability (if any)</option>
            <option value="None">None</option>
            <option value="Visual Impairment">Visual Impairment</option>
            <option value="Hearing Impairment">Hearing Impairment</option>
            <option value="Mobility Impairment">Mobility Impairment</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit">Register</button>
          <p className="register-link">
            Already have an account? <a href="/">Login here</a>.
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
