import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Landing from "./components/landing/landing";
import Login from "./components/login/login"
import Register from "./components/register/register";
import Home from "./components/home/home";
import Watchlist from "./components/watchlist/watchlist";
import Watchhistory from "./components/watchhistory/watchhistory";
import Changepassword from "./components/changepassword/changepassword";
import Watchmovies from "./components/watchmovie/watchmovie";
import ProtectedRoute from "./components/protcetedroute";


const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: 'landing', element: <Landing /> },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  {
    path: 'home',
    element: <ProtectedRoute element={<Home />} />,
  },
  {
    path: 'watchlist',
    element: <ProtectedRoute element={<Watchlist />} />,
  },
  {
    path: 'history',
    element: <ProtectedRoute element={<Watchhistory />} />,
  },
  {
    path: 'changepassword',
    element: <ProtectedRoute element={<Changepassword />} />,
  },
  {
    path: 'watchmovie/:id/',
    element: <ProtectedRoute element={<Watchmovies />} />,
  },
]);


export default router;
