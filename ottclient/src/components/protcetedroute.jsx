import Nologin from "./no-login/nologin";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Nologin />;
  }

  return element;
};

export default ProtectedRoute;
