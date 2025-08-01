import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './books.css';

// ✅ Centralize backend URL for deployment
const BASE_URL = 'https://newsbackend-73b7.onrender.com';

const Books = () => {
  const [booksNews, setBooksNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getBooksNews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/News`);
      const books = response.data.filter(
        item => item.category?.toLowerCase() === 'books'
      );
      setBooksNews(books);
    } catch (err) {
      console.error('Failed to fetch books news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getBooksNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="start-books-section">
        <div className="start-books-heading-row">
          <h1 className="start-books-section-title">Books</h1>
          <span className="start-books-heading-line"></span>
        </div>

        {loading ? (
          <div className="start-books-loader">
            <Spin size="large" />
          </div>
        ) : booksNews.length === 0 ? (
          <Empty
            description="No books news available"
            className="start-books-empty-state"
          />
        ) : (
          <div className="start-books-news-listing">
            {booksNews.map(item => (
              <div
                key={item._id}
                className="start-books-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0].startsWith('http')
                        ? item.images[0]
                        : `${BASE_URL}/${item.images[0]}`
                      : `${BASE_URL}/images/no-image.jpg`
                  }
                  alt={item.title}
                  className="start-books-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `${BASE_URL}/images/no-image.jpg`;
                  }}
                />
                <div className="start-books-news-content">
                  <div className="start-books-news-category">Books</div>
                  <div className="start-books-news-title">{item.title}</div>
                  <div className="start-books-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="start-books-news-date">
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

export default Books;
