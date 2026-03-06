import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import FullPageLoading from '../Components/UI/FullPageLoading';
import { useGetUserQuery } from '../services/apiAuth';
import { getItem } from '../utils/localStorage';

const ProtectedRoute = ({ children, authPage }) => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserQuery(null, {
    skip: !getItem('token'),
  });
  const isAuth = data;

  useEffect(() => {
    if (isLoading) return;
    if (isAuth && authPage) {
      navigate('/home');
    }

    if (!isAuth && !authPage) {
      navigate('/login');
    }
  }, [isAuth, authPage, navigate, isLoading]);
  if (isLoading) return <FullPageLoading />;

  if (!isLoading && authPage && isAuth) return null;
  if (!isLoading && !authPage && !isAuth) return null;
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  authPage: PropTypes.bool,
};

export default ProtectedRoute;
