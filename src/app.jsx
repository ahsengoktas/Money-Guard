import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { refreshUser } from './redux/auth/auth-operations';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return <h1>Money Guard</h1>;
};

export default App;
