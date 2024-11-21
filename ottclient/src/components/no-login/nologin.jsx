import React from 'react';
import { Link } from "react-router-dom";

function Nologin() {
    return (
        <div>
            <h1 className='text-center my-5 display-3'>Please log in</h1>
            <div className="d-flex justify-content-center my-4">
                <Link to="/login" className="btn btn-light">Go to Login</Link>
            </div>
        </div>
    );
}

export default Nologin;