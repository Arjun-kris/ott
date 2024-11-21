import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Moviecard from '../moviecard/moviecard';
import axios from 'axios';

function Watchlist() {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem('token');
  const moviesPerPage = 3;

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('http://localhost:8000/watchlist/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setWatchlistMovies(response.data);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchlist();
  }, [token]);

  const removeFromWatchlist = async (movieId) => {
    try {
      await axios.delete(`http://localhost:8000/remove_from_watchlist/${movieId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setWatchlistMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const goToWatchmovie = async (movieId) => {
    navigate(`/watchmovie/${movieId}`);
    const addToHistory = async () => {
        try {
            await axios.post(
                `http://localhost:8000/add_watch_history/${movieId}/`,
                {},
                { headers: { Authorization: `Token ${token}` } }
            );
        } catch (error) {
            console.error("Error adding to watch history:", error);
        }
    };

    addToHistory();
  };

  const last = currentPage * moviesPerPage;
  const first = last - moviesPerPage;
  const currentMovies = watchlistMovies.slice(first, last);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="container-fluid my-4">
        <h2 className="display-4 mt-3 text-light text-center">Watchlist</h2>
        <div className="container-fluid mt-5">
          <div className='d-flex justify-content-center'>
          <div className='row'>
            {currentMovies.length > 0 ? (
              currentMovies.map((movie) => (
                <div key={movie.id} className='col-md-4 mb-3'>
                  <Moviecard
                    name={movie.name}
                    description={movie.description}
                    thumbnail={movie.thumbnail}
                    buttonset={
                      <div className="d-flex justify-content-end">
                        <button onClick={() => goToWatchmovie(movie.id)}  className="btn btn-custom mr-3">
                          Watch
                        </button>
                        <button onClick={() => removeFromWatchlist(movie.id)} className="btn btn-danger">
                          Remove
                        </button>
                      </div>
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-light text-center">Your watchlist is empty.</p>
            )}
          </div>
          </div>

          <div className="d-flex justify-content-center">
            {Array.from({ length: Math.ceil(watchlistMovies.length / moviesPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`btn ${currentPage === index + 1 ? 'btn-custom' : 'btn-outline-custom'} mx-1`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="d-flex justify-content-center">
            <a href="/home" className="btn btn-outline-custom my-5">
              <i className="fas fa-plus-circle mr-2"></i>Add Watchlist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
