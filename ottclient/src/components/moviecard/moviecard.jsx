import React from 'react'
import './moviecard.css' 


function Moviecard({ name, description, thumbnail, buttonset }) {
    return (
        <div className="card custom-shadow mb-4">
            <img src={thumbnail} alt={name} className="card-img-top rounded" />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
                {buttonset}
            </div>
        </div>
    );
}


export default Moviecard;

