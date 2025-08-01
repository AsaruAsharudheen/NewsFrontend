import './hometicker.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomeTicker = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickerNews = async () => {
      try {
        const res = await axios.get('https://newsbackend-73b7.onrender.com/api/News');
        setNews(res.data.slice(0, 20)); // show first 20
      } catch (err) {
        console.error('Failed to fetch ticker news:', err);
      }
    };
    fetchTickerNews();
  }, []);

  return (
    <div className="ticker-wrapper">
      <div className="ticker-content">
        {news.map((item) => (
          <div
            key={item._id}
            className="ticker-card"
            onClick={() => navigate(`/news/${item._id}`)}
          >
            <img
              src={
                item.images && item.images.length > 0
                  ? item.images[0].startsWith('http')
                    ? item.images[0]
                    : `https://newsbackend-73b7.onrender.com/${item.images[0]}`
                  : 'https://newsbackend-73b7.onrender.com/images/no-image.jpg'
              }
              alt={item.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://newsbackend-73b7.onrender.com/images/no-image.jpg';
              }}
            />
            <div className="ticker-text">
              <div className="ticker-category">{item.category || 'General'}</div>
              <div className="ticker-title">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTicker;
