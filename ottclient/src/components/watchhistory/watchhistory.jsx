import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/navbar';
import axios from 'axios';

function Watchhistory() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem('token');
  const recordPerPage = 3;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get_watch_history/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setHistory(response.data);
      } catch (error) {
        console.log("Error fetching watch history:", error);
      }
    };

    fetchHistory();
  }, [token]);


  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB');
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${formattedDate}, ${formattedTime}`;
  };

  const last = currentPage * recordPerPage;
  const first = last - recordPerPage;
  const currentHistory = history.slice(first, last);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="container-fluid my-4">
        <h2 className='display-4 mt-3 text-light text-center'>Watch History of {}</h2>
        <div className='container my-5'>
          {currentHistory.length > 0 ? (
            currentHistory.map((movie) => (
              <div className="card w-100 mt-3 mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="card-title text-black">Movie: {movie.movie_name}</h5>
                    <p className="card-date text-black">Date: {formatDateTime(movie.date_viewed)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-light">No watch history available.</p>
          )}
        </div>

        <div className="d-flex justify-content-center">
          {Array.from({ length: Math.ceil(history.length / recordPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`btn ${currentPage === index + 1 ? 'btn-custom' : 'btn-outline-custom'} mx-1`}
            >
              {index + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Watchhistory;
