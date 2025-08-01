import './related.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RelatedNews = ({ category, currentId }) => {
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRelatedNews = async () => {
    try {
      const response = await axios.get('http://localhost:8889/api/News');
      const filtered = response.data.filter(
        (item) =>
          item.category?.toLowerCase() === category?.toLowerCase() &&
          item._id !== currentId
      );
      setRelatedNews(filtered);
    } catch (error) {
      console.error('Error loading related news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category && currentId) {
      fetchRelatedNews();
    }
  }, [category, currentId]);

  if (loading) {
    return (
      <div className="related-loader">
        <Spin size="large" />
      </div>
    );
  }

  if (relatedNews.length === 0) {
    return <Empty description="No related news found" className="related-empty" />;
  }

  return (
    <div className="related-news-wrapper">
      <Title level={4} className="related-title">Related News</Title>
      <div className="related-news-list">
        {relatedNews.map((item) => (
          <div
            className="related-news-item"
            key={item._id}
            onClick={() => navigate(`/news/${item._id}`)}
          >
            <div className="related-news-image-col">
              <img
                src={
                  item.images && item.images.length > 0
                    ? item.images[0].startsWith('http')
                      ? item.images[0]
                      : `http://localhost:8889/${item.images[0]}`
                    : 'http://localhost:8889/images/no-image.jpg'
                }
                alt={item.title}
                className="related-news-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'http://localhost:8889/images/no-image.jpg';
                }}
              />
            </div>
            <div className="related-news-text-col">
              <p className="related-news-title">{item.title}</p>
              <p className="related-news-date">
                {new Date(item.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedNews;
