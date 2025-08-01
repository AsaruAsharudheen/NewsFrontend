import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './food.css';

const Food = () => {
  const [foodNews, setFoodNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getFoodNews = async () => {
    try {
      const response = await axios.get('http://localhost:8889/api/News');
      const food = response.data.filter(
        item => item.category?.toLowerCase() === 'food'
      );
      setFoodNews(food);
    } catch (err) {
      console.error('Failed to fetch food news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getFoodNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="start-food-section">
        <div className="start-food-heading-row">
          <h1 className="start-food-section-title">FOOD</h1>
          <span className="start-food-heading-line"></span>
        </div>

        {loading ? (
          <div className="start-food-loader">
            <Spin size="large" />
          </div>
        ) : foodNews.length === 0 ? (
          <Empty
            description="No food news available"
            className="start-food-empty-state"
          />
        ) : (
          <div className="start-food-news-listing">
            {foodNews.map(item => (
              <div
                key={item._id}
                className="start-food-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : 'http://localhost:8889/images/no-image.jpg'
                  }
                  alt={item.title}
                  className="start-food-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:8889/images/no-image.jpg';
                  }}
                />
                <div className="start-food-news-content">
                  <div className="start-food-news-category">Food</div>
                  <div className="start-food-news-title">{item.title}</div>
                  <div className="start-food-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="start-food-news-date">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'No date'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Food;
