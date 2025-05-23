import React, { useState } from "react";
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formValues, setFormValues] = useState({
        email: "",
        password: ""
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
        const { email, password } = formValues;
        
        if (!email || !password) {
            setErrorMessage("All fields are required.");
            return;
        }

        setErrorMessage("");
        console.log("Form submitted:", formValues);
    };

    return (
        <div className="login-page">
            <div className="logo">SPORTER</div>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                />

                <label htmlFor="password">Password</label>
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formValues.password}
                        onChange={handleInputChange}
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                    />
                </div>
                <div className="login-link">
                    <a>Forget your password?</a>
                    <Link to="/signup">Create account</Link>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="login-btn">LOG IN</button>
            </form> 
        </div>
    );
}