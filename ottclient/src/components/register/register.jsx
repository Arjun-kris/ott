import React, { useState } from 'react';
import axios from 'axios';
import "../../App.css";
import './register.css';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showconfirmPassword, setShowconfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/signup/', {
                username: email,
                email: email,
                password: password,
                first_name: firstName,
            });

            if (response.status === 201) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', email);
                window.location.href = '/home';
            }

        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="bodybg">
            <div className="d-md-flex justify-content-center align-items-center vh-100 fade-in">
                <h1 className="display-1 text-center text-light head">Please Signup</h1>
                <div className="container col-ls-6">
                    <div className="container col-md-6 bg-white mt-5 p-4 rounded login">
                        <div>
                            <h1 className="text-center mb-5">Signup</h1>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        className="form-control bg-light mb-3"
                                        type="text"
                                        placeholder="Enter First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        className="form-control bg-light mb-3"
                                        type="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        className='col-11 form-control bg-light mb-3'
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder='Enter Password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="col-1 input-group-append-sm my-1">
                                        <div onClick={() => setShowPassword((prev) => !prev)}>
                                            <i className={
                                                showPassword ? "fas fa-eye" : "fas fa-eye-slash"
                                            }></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <input
                                        className='col-11 form-control bg-light mb-3'
                                        type={
                                            showconfirmPassword ? "text" : "password"
                                        }
                                        placeholder='Confirm Password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <div className="col-1 input-group-append-sm my-1">
                                        <div onClick={() => setShowconfirmPassword((prev) => !prev)}>
                                            <i className={
                                                showconfirmPassword ? "fas fa-eye" : "fas fa-eye-slash"
                                            }></i>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="container btn btn-outline-custom">
                                    Register
                                </button>
                            </form>
                            {error && <p className="text-danger mt-2">{error}</p>}
                        </div>
                        <p className="text-dark text-center mt-1">
                            Already have an account?{" "}
                            <a className="text-secondary" href="/login">
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
