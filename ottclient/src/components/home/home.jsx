import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Moviecard from '../moviecard/moviecard';
import axios from 'axios';

function Home() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedMovies, setSearchedMovies] = useState([]);
    const [isButton, setButton] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    let button = null;

    const handleSearch = () => {
        setButton(true);
        const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
        if (lowercasedSearchTerm === "") {
            setSearchedMovies([]);
            return;
        }  
        const filtered = movies.filter((movie) => {
            const movieName = movie.name ? movie.name.toLowerCase() : '';
            const regex = new RegExp(`\\b${lowercasedSearchTerm}`, 'i');
            return regex.test(movieName);
        });
        setSearchedMovies(filtered);

        if (filtered.length === 0) {
            setTimeout(() => {
                resetSearch();
            }, 5000);
        }
    };

    const resetSearch = () => {
        setSearchTerm("");
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/movie_list/',
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                console.log("Movies fetched:", response.data);
                setMovies(response.data);
                setSearchedMovies(response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchMovies();

        const storedUsername = localStorage.getItem('firstname');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, [token]);

    const addToWishlist = async (movieId) => {
        try {
            await axios.post(
                `http://localhost:8000/add_to_wishlist/${movieId}/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setModalOpen(true);
            setTimeout(() => {
                setModalOpen(false);
              }, 1000);
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            alert("Failed to add to wishlist");
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

    if (!isButton) {
        button = <button type="submit" className="btn btn-custom">Search</button>;
    } else {
        button = <button onClick={resetSearch} className="btn btn-danger">Reset</button>;
    }


    return (
        <div>
            <Navbar />
            <div className="container-fluid my-4">
                <h2 className='display-4 my-3 text-light'>Welcome, {username}</h2>
                <div className='container-fluid'>
                    <h3 className='my-4 text-light text-center'>Movies</h3>
                    <form id="search-form" className="d-flex justify-content-between my-3">
                        <input
                            type="text"
                            className="form-control bg-light mr-3"
                            placeholder="Search by name of movie"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                handleSearch(e)
                            }}
                        />
                        {button}
                    </form>
                    <div className='container-fluid'>
                        <div className="row">
                            {searchedMovies.length > 0 ? (
                                searchedMovies.map((movie) => (
                                    <div key={movie.id} className='col-md-4 mb-3'>
                                        <Moviecard
                                            name={movie.name}
                                            description={movie.description}
                                            thumbnail={movie.thumbnail_url}
                                            buttonset={
                                                <div className='d-flex justify-content-end'>
                                                    <button onClick={() => goToWatchmovie(movie.id)} className='btn btn-custom mr-3'>Watch</button>
                                                    <button onClick={() => addToWishlist(movie.id)} className='btn btn-success'>Add to Watchlist</button>
                                                    {isModalOpen && (
                                                        <div className="modal modallogout2" style={{top: '-200px'}}>
                                                            <div className="modal-dialog modal-dialog-centered">
                                                                <div className="modal-content modallogoutcontent">
                                                                    <div className="modal-body p-5">
                                                                        <h4 className='text-center text-light'>Movie added to Watchlist</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </div>
                                    
                                ))
                            ) : (
                                <p className="text-light text-center">No movies found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;
