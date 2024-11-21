import React, { useState } from "react";
import axios from "axios";
import "../../App.css";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/login/", {
                username: email,
                password: password,
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("firstname", response.data.first_name);
                window.location.href = "/home";
            }
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false); // Hide spinner after request completes
        }
    };

    return (
        <div className="bodybg">
            {/* Full-screen spinner */}
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="d-md-flex justify-content-center align-items-center vh-100 fade-in">
                <h1 className="display-1 text-center text-light head">Please Login</h1>
                <div className="container col-ls-6">
                    <div className="container col-md-6 bg-white mt-5 p-4 rounded login">
                        <div>
                            <h1 className="text-center mb-5">Login</h1>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <form onSubmit={handleLogin}>
                                <input
                                    className='form-control bg-light mb-3'
                                    type="email"
                                    placeholder='Enter Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="input-group mb-3">
                                    <input
                                        className='col-11 form-control bg-light mb-3'
                                        type={showPassword ? "text" : "password"}
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
                                <button type="submit" className='container btn btn-outline-custom'>
                                    Login
                                </button>
                            </form>
                        </div>
                        <p className="text-dark text-center mt-1">
                            Don't have an account? <a className="text-secondary" href="/register">Signup here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
