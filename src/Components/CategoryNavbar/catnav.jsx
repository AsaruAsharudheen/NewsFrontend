import { useNavigate } from 'react-router-dom';
import './catnav.css';

const CatNavbar = () => {
  const navigate = useNavigate();
  return (
    <div className="cat-navbar">
      <div className="cat-navbar-left">
        <i
          onClick={() => {
            navigate('/');
          }}
          className="fa-solid fa-arrow-left back-icon"
        ></i>
      </div>
      <div className="cat-navbar-right">
        <h1 className="logo-title">
          <span className="logo-white">Newsify</span>
        </h1>
        <span className="tagline">JOURNALISM OF COURAGE</span>
      </div>
    </div>
  );
};

export default CatNavbar;
