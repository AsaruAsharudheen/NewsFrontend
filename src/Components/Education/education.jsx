import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './education.css';

const Education = () => {
  const [educationNews, setEducationNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:8889/api/News');
        const filtered = res.data.filter(
          item => item.category?.toLowerCase() === 'education'
        );
        setEducationNews(filtered);
      } catch (err) {
        console.error('Failed to fetch education news', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="education-section">
        <div className="business-heading-row">
          <h1 className="business-section-title">EDUCATION</h1>
          <span className="heading-line"></span>
        </div>

        {loading ? (
          <div className="education-loader">
            <Spin size="large" />
          </div>
        ) : educationNews.length === 0 ? (
          <div className="education-empty-state">
            <Empty description="No education news available" />
          </div>
        ) : (
          <div className="education-news-listing">
            {educationNews.map(item => (
              <div
                key={item._id}
                className="education-news-card"
                onClick={() => navigate(`/news/${item._id}`)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : 'http://localhost:8889/images/no-image.jpg'
                  }
                  alt={item.title}
                  className="education-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:8889/images/no-image.jpg';
                  }}
                />
                <div className="education-news-content">
                  <span className="education-news-category">Education</span>
                  <h3 className="education-news-title">{item.title}</h3>
                  <p className="education-news-summary">
                    {item.summary?.slice(0, 120)}...
                  </p>
                  <span className="education-news-date">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Education;
