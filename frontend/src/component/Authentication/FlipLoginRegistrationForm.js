// src/components/FlipLoginRegistrationForm.js
import React, { useState, useEffect } from 'react';
import './FlipLoginRegistrationForm.css';
import { useNavigate } from 'react-router-dom';



function FlipLoginRegistrationForm() {
    const navigate = useNavigate();
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState(null);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        // When the 'isRegistered' state changes to true, automatically flip to the login form
        if (isRegistered) {
            setIsLoginForm(true);
        }
    }, [isRegistered]);

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
        setIsRegistered(false); // Reset 'isRegistered' when flipping
        setError(null); // Reset error message when flipping
        setEmailError('');
        setPasswordError('');
    };

    const formClass = isLoginForm ? 'login-form' : 'registration-form';

    const handleRegistrationSuccess = () => {
        setIsRegistered(true); // Set 'isRegistered' to true when registration is successful
        setError(null); // Reset error message
        setEmailError('');
        setPasswordError('');

        // Reset the form data
        setFormData({
            name: '',
            email: '',
            password: '',
        });
    };

    const validateEmail = (email) => {

        if (email.includes('@')) {
            setEmailError('');
            return true;
        } else {
            setEmailError('Invalid email address');
            return false;
        }
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

        if (passwordPattern.test(password)) {
            setPasswordError('');
            return true;
        } else {
            setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmailValid = validateEmail(formData.email);
        const isPasswordValid = validatePassword(formData.password);

        if (isLoginForm) {
            //Perform Login
            if (isEmailValid && isPasswordValid) {
                try {
                    const loginData = {
                        email: formData.email,
                        password: formData.password,
                    };
                    const response = await fetch('http://192.168.68.26:8080/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(loginData),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        console.log('Login successful:', data);
                        // Handle successful login
                        navigate('/home'); // Navigate to the "/home" page
                    } else {
                        console.error('Login failed:', data);
                        setError('Login failed: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error logging in:', error);
                    setError('Error logging in: ' + error.message);
                }
            }
        } else {
            // Perform registration
            if (isEmailValid && isPasswordValid) {
                try {
                    const registrationData = {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    };

                    const response = await fetch('http://192.168.68.26:8080/api/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(registrationData),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log('Registration successful:', data);
                        handleRegistrationSuccess();
                    } else {
                        console.error('Registration failed:', data);
                        setError('Registration failed: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error registering:', error);
                    setError('Error registering: ' + error.message);
                }
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="main-body-container">
        <div className={`flip-container ${isLoginForm ? '' : 'flip'}`}>
            <div className={`flip-form ${formClass}`}>
                <h2>{isLoginForm ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLoginForm && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className={`registration-button btn ${isLoginForm ? '' : 'btnBack'}`}>
                        {isLoginForm ? 'Log in' : 'Sign Up'}
                    </button>
                </form>
                {isRegistered && isLoginForm && (
                    <p className="success-message">Registration Successful! Please log in.</p>
                )}
                <p onClick={toggleForm} className="toggle-form">
                    {isLoginForm ? "Don't have an account? Register" : 'Already have an account? Login'}
                </p>
            </div>
        </div>
        </div>
    );
}

export default FlipLoginRegistrationForm;
