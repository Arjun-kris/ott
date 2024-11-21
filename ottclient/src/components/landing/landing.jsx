import React from "react";
import "../../App.css"
import "./landing.css"

function Landing() {
    return (
        <div className="bodybg">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="container">
                    <h1 className="display-1 text-center text-light font-weight-normal">Welcome to OTT Platform</h1>
                    <div className="d-flex justify-content-center align-items-center m-5">
                        <a className="btn btn-custom p-2 w-25" href="/login">Go{">>"}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing;