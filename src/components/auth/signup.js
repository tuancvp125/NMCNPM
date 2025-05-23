import React, { useState } from "react";
import './signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [formValues, setFormValues] = useState({
        userName: "",
        email: "",
        password: "",
        rePassword: "",
        address: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleRePasswordVisibility = () => {
        setShowRePassword(!showRePassword);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { userName, email, password, rePassword, address } = formValues;
        
        if (!userName || !email || !password || !rePassword || !address) {
            setErrorMessage("All fields are required.");
            return;
        }

        if (password !== rePassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setErrorMessage("");
        console.log("Form submitted:", formValues);
    };

    return (
        <div className="signup-page">
            <div className="signup-left">
                <div className="signup-logo">SPORTER</div>
                <Link to="/login" className="signupToLogin-btn">LOG IN</Link>
            </div>
            <div className="signup-right">
                <div className="signup-text">Create a new account</div>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <label htmlFor="userName" className="signup-label">Username</label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={formValues.userName}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="email" className="signup-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="password" className="signup-label">Password</label>
                    <div className="signup-password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formValues.password}
                            onChange={handleInputChange}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            className="signup-toggle-password"
                            onClick={togglePasswordVisibility}
                            aria-label="Toggle password visibility"
                        />
                    </div>

                    <label htmlFor="rePassword" className="signup-label">Re-Password</label>
                    <div className="signup-password-container">
                        <input
                            type={showRePassword ? "text" : "password"}
                            id="rePassword"
                            name="rePassword"
                            value={formValues.rePassword}
                            onChange={handleInputChange}
                        />
                        <FontAwesomeIcon
                            icon={showRePassword ? faEye : faEyeSlash}
                            className="signup-toggle-password"
                            onClick={toggleRePasswordVisibility}
                            aria-label="Toggle re-password visibility"
                        />
                    </div>

                    <label htmlFor="address" className="signup-label">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formValues.address}
                        onChange={handleInputChange}
                    />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className="signup-btn">SIGN UP</button>
                </form>
            </div>
        </div>
    );
}
