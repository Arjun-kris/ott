import React, { useState } from 'react';
import axios from "axios";
import './navbar.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = async () => {
        await axios.post('http://localhost:8000/logout/', {}, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('firstname');
        navigate('/login');
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <nav className="nav-pills navbar navbar-expand-sm navbar-dark bg-dark sticky-top py-3">
            <div className="navbar-brand">
                <h4><i className="fas fa-video"></i> OTT Platform</h4>
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    <li className="nav-item">
                        <NavLink to={"/home"} className="nav-link p-2">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={"/watchlist"} className="nav-link p-2">Watchlist</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={"/history"} className="nav-link p-2">History</NavLink>
                    </li>
                    <div className="dropdown-divider"></div>
                    <div className='divider mx-2'></div>
                    <li className="nav-item">
                        <NavLink to={"/changepassword"} className="nav-link p-2">Change Password</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link btn-danger p-2" onClick={() => setModalOpen(true)}>
                            Logout
                        </NavLink>
                    </li>
                </ul>
            </div>

            {isModalOpen && (
                <div className="modal modallogout">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modallogoutcontent">
                            <div className="modal-body p-5">
                                <h3 className='text-center text-light'>Are you sure you want to logout?</h3>
                                <div className='d-flex justify-content-center p-5'>
                                    <button className="btn btn-outline-danger mr-3" onClick={handleLogout}>
                                        Logout
                                    </button>
                                    <button className="btn btn-outline-custom" onClick={closeModal}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
