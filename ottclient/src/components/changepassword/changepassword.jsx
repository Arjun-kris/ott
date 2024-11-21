import React, { useState } from 'react';
import '../../App.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Changepassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleupdate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/change_password/',
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setTimeout(() => navigate('/home'), 2000);
    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  function goToHomePage() {
    navigate('/home');
  }

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="container col-ls-6">
          <div className="container col-md-8 mt-5 p-4 rounded">
            <div>
              <h1 className="text-center text-light mb-5">Change the Password</h1>
              <form onSubmit={handleupdate}>
                <div className="form-group row">
                  <label htmlFor="currentPassword" className="col-sm-4 col-form-label text-light text-right">
                    Current Password:
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="newPassword" className="col-sm-4 col-form-label text-light text-right">
                    New Password:
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="confirmPassword" className="col-sm-4 col-form-label text-light text-right">
                    Confirm Password:
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                {successMessage && <p className="text-success text-center">{successMessage}</p>}
                <div className="d-flex justify-content-center p-5">
                  <button type="submit" className="btn btn-outline-success mr-3">
                    Update
                  </button>
                  <button type="button" className="btn btn-outline-custom" onClick={goToHomePage}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Changepassword;
