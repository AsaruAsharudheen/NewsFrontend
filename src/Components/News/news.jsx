import './news.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Empty } from 'antd';
import CatNavbar from '../CategoryNavbar/catnav';
import RelatedNews from '../RelatedNews/related';

const { Title, Paragraph } = Typography;

// ✅ Use your Render backend
const API_BASE = 'https://newsbackend-73b7.onrender.com';

const News = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getNewsById = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/News/${id}`);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNewsById();
  }, [id]);

  if (loading) {
    return (
      <div className="news-loader">
        <Spin size="large" />
      </div>
    );
  }

  if (!news) {
    return <Empty description="News not found" className="news-empty" />;
  }

  const mainImage =
    news.images && news.images.length > 0
      ? news.images[0].startsWith('http')
        ? news.images[0]
        : `${API_BASE}/${news.images[0]}`
      : `${API_BASE}/images/no-image.jpg`;

  const otherImages =
    news.images && news.images.length > 1 ? news.images.slice(1) : [];

  return (
    <>
      <CatNavbar />
      <div className="news-wrapper">
        {/* Category */}
        {news.category && (
          <div className="news-category-badge">{news.category}</div>
        )}

        {/* Title */}
        <Title level={3} className="news-title">
          {news.title}
        </Title>
        <div className="news-title-underline"></div>

        {/* Full Content */}
        <Paragraph className="news-full-content">
          {news.content || 'No detailed content available.'}
        </Paragraph>

        {/* Main Image */}
        {mainImage && (
          <div className="news-image-container">
            <img
              src={mainImage}
              alt="news"
              className="news-main-image"
              onError={e => {
                e.target.onerror = null;
                e.target.src = `${API_BASE}/images/no-image.jpg`;
              }}
            />
          </div>
        )}

        {/* Summary */}
        {news.summary && (
          <>
            <Title level={5} className="news-section-title">
              Summary
            </Title>

            <Paragraph className="news-summary">
              {news.summary.slice(0, 903)}

              <img
                src="/ksfe-ad-1200x600-vujc.webp"
                alt="Ad Banner"
                className="ads-banner"
              />

              {news.summary.slice(903)}
            </Paragraph>
          </>
        )}

        {/* Video Section */}
        {news.video && (
          <div className="news-video-wrapper">
            <video
              src={news.video}
              controls
              className="news-video-player"
              poster={mainImage}
            >
              Sorry, your browser does not support embedded videos.
            </video>
          </div>
        )}

        {/* Other Images */}
        {otherImages.length > 0 && (
          <div className="news-other-images">
            {otherImages.map((url, index) => (
              <img
                key={index}
                src={
                  url.startsWith('http')
                    ? url
                    : `${API_BASE}/${url}`
                }
                alt={`Additional ${index + 1}`}
                className="news-summary-image"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = `${API_BASE}/images/no-image.jpg`;
                }}
              />
            ))}
          </div>
        )}

        {/* Related News */}
        {news.category && (
          <div className="related-news-bottom">
            <RelatedNews category={news.category} currentId={news._id} />
          </div>
        )}
      </div>
    </>
  );
};

export default News;
