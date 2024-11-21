import React, { useState, useEffect } from 'react';
import './watchmovie.css'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';

function Watchmovies() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const token = localStorage.getItem('token');
    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/movie_detail/${id}/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                setMovie(response.data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };
        fetchMovie();

    }, [id, token]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    const handleThumbnailClick = async () => {
        setIsPlaying(true);

        if (movie) {
            try {
                await axios.patch(
                    `http://localhost:8000/increment_view_count/${id}/`,
                    { view_count: movie.view_count + 1 },
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setMovie((prevMovie) => {
                    const updatedMovie = Object.assign({}, prevMovie);
                    updatedMovie.view_count += 1;
                    return updatedMovie;
                });
            } catch (error) {
                console.error("Error updating view count:", error);
            }
        }
    };

    const goTohome = async () => {
        navigate(`/home`);
    }


    return (
        <div>
            <Navbar />
            <div className="container-fluid my-4">
                <h2 className='display-3 my-3 text-light text-center'>View Movie</h2>
                <h4 className='display-5 mt-5 text-light'>Movies: {movie.name}</h4>
                <p className='display-5 mb-5 text-light text-justify font-italic'>"{movie.description}"</p>
                <div className='container pb-4'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='videocontainer'>
                            {isPlaying ? 
                            (
                                <video className='d-flex justify-content-center align-items-center container col-9' controls autoPlay>
                                    <source src={movie.video_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className='videotab'>
                                    <img
                                        src={movie.thumbnail}
                                        alt="Video Thumbnail"
                                        className='img'
                                    />
                                    <div className="overlay">
                                        <div className='icon' onClick={handleThumbnailClick}>
                                            <i className="fa fa-play"></i>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center align-items-center mt-4'>
                    <button className='btn btn-outline-custom' onClick={goTohome}>Back to Home</button>
                </div>
            </div>
        </div>
    )
}

export default Watchmovies