import './home.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Empty, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';

import Navbar from '../Navbar/navbar';
import HomeLatest from '../HomeLatest/homelatest';
import HomePolitics from '../HomePolitics/hompolitics';
import HomSports from '../HomSports/homsports';
import HomeBusiness from '../HomeBusiness/homBusiness';
import About from '../About/about';
import HomeEducation from '../HomeEducation/homeducation';
import HomeTicker from '../HomeTicker/hometicker';

// ✅ Consistent BASE_URL
const BASE_URL = 'https://newsbackend-73b7.onrender.com';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/News`);
        setNews(res.data);
      } catch (err) {
        console.error('Failed to fetch news', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Navbar />
      <HomeTicker />
      <HomeLatest />
      <HomePolitics />
      <HomSports />
      <HomeEducation />
      <HomeBusiness />

      <div className="home-section">
        <div className="business-heading-row">
          <h1 className="business-section-title">ALLNEWS</h1>
          <span className="heading-line"></span>
        </div>
        <Divider />

        {loading ? (
          <div className="home-loader">
            <Spin size="large" />
          </div>
        ) : news.length === 0 ? (
          <Empty description="No news available" className="home-empty-state" />
        ) : (
          <div className="home-news-listing">
            {news.map(item => (
              <div
                key={item._id}
                className="home-news-card"
                onClick={() => navigate(`/news/${item._id}`)}
              >
                <img
                  alt={item.title}
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0].startsWith('http')
                        ? item.images[0]
                        : `${BASE_URL}/${item.images[0]}`
                      : `${BASE_URL}/images/no-image.jpg`
                  }
                  className="home-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `${BASE_URL}/images/no-image.jpg`;
                  }}
                />
                <div className="home-news-content">
                  <div className="home-news-category">
                    {item.category || 'GENERAL'}
                  </div>
                  <h3 className="home-news-title">{item.title}</h3>
                  <div className="home-news-date">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <About />
    </>
  );
};

export default Home;
