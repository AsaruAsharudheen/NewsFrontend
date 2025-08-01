import { Outlet, Navigate } from 'react-router-dom';

import { CheckToken } from '../../../Utils';

const PrivateRoute = () => {
  if (CheckToken()) return <Outlet />;
  else return <Navigate to="/admin/login" />;
};

export default PrivateRoute;
