import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../Components/AdminLayout/layout';
import { Button, Select, message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import {
  UploadOutlined,
  VideoCameraOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import './update.css';

const { Option } = Select;

const UpdateNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    images: [],
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`http://localhost:8889/api/News/${id}`);
        setNews(res.data);
        setVideoUrl(res.data.video || '');
      } catch (err) {
        console.error('Error fetching news:', err);
        message.error('Failed to fetch news');
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e, key) => {
    setNews(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleCategoryChange = value => {
    setNews(prev => ({ ...prev, category: value }));
  };

  const beforeUploadImage = file => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Only image files are allowed!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleImageUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('images', file);

    try {
      const res = await axios.post(
        'http://localhost:8889/api/upload',
        formData
      );
      const uploadedUrl = res.data.urls?.[0] || res.data.url;

      setNews(prev => ({
        ...prev,
        images: [...prev.images, uploadedUrl],
      }));

      message.success('Image uploaded successfully');
    } catch (err) {
      console.error('Image upload failed:', err);
      message.error('Failed to upload image');
    }
  };

  const handleDeleteImage = index => {
    setNews(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
    message.info('Image removed');
  };

  // VIDEO: select file
  const beforeUploadVideo = file => {
    const isVideo = file.type.startsWith('video/');
    if (!isVideo) {
      message.error('Only video files are allowed!');
      return Upload.LIST_IGNORE;
    }
    setVideoFile(file);
    message.success(`Selected video: ${file.name}`);
    return false;
  };

  // VIDEO: upload to backend
  const handleUploadVideo = async () => {
    if (!videoFile) {
      return message.warning('Please select a video first.');
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const res = await axios.post(
        'http://localhost:8889/api/uploadVideo',
        formData
      );
      setVideoUrl(res.data.url);
      message.success('Video uploaded successfully!');
    } catch (err) {
      console.error('Video upload failed:', err);
      message.error('Video upload failed.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        title: news.title.trim(),
        summary: news.summary.trim(),
        content: news.content.trim(),
        category: news.category,
        images: news.images,
        video: videoUrl,
      };

      await axios.patch(`http://localhost:8889/api/News/${id}`, payload);
      message.success('News updated successfully');
      navigate('/admin/list');
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
      message.error('Update failed');
    }
  };

  return (
    <AdminLayout>
      <form className="update-news-form" onSubmit={handleSubmit}>
        <div className="form-left">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={news.title}
              onChange={e => handleChange(e, 'title')}
              required
            />
          </div>

          <div className="form-group">
            <label>Summary:</label>
            <textarea
              value={news.summary}
              onChange={e => handleChange(e, 'summary')}
              rows={2}
              required
            />
          </div>

          <div className="form-group">
            <label>Content:</label>
            <textarea
              value={news.content}
              onChange={e => handleChange(e, 'content')}
              rows={5}
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <Select
              value={news.category}
              onChange={handleCategoryChange}
              style={{ width: '100%' }}
              required
            >
              <Option value="Politics">Politics</Option>
              <Option value="Sports">Sports</Option>
              <Option value="Business">Business</Option>
              <Option value="Health">Health</Option>
              <Option value="Education">Education</Option>
              <Option value="food">Food</Option>
              <Option value="women">Women</Option>
              <Option value="pravasi">Pravasi</Option>
              <Option value="culture">Culture</Option>
              <Option value="opinion">Opinion</Option>
              <Option value="books">Books</Option>
            </Select>
          </div>
        </div>

        <div className="form-right">
          <div className="form-group">
            <label>Images:</label>
            <ImgCrop rotate zoom aspect={16 / 9} showReset>
              <Upload
                customRequest={handleImageUpload}
                beforeUpload={beforeUploadImage}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload / Add Image</Button>
              </Upload>
            </ImgCrop>

            {news.images.length > 0 && (
              <div
                className="image-preview-group"
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}
              >
                {news.images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    <img
                      src={img}
                      alt={`News ${idx}`}
                      className="image-preview"
                      style={{
                        width: 200,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                      }}
                    />
                    <Button
                      size="small"
                      danger
                      type="primary"
                      onClick={() => handleDeleteImage(idx)}
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        padding: '0 6px',
                        lineHeight: '20px',
                        height: 'auto',
                      }}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: 24 }}>
            <label>Video:</label>
            <Upload
              beforeUpload={beforeUploadVideo}
              showUploadList={false}
              accept="video/*"
            >
              <Button icon={<VideoCameraOutlined />}>Choose Video</Button>
            </Upload>

            {videoFile && (
              <div style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  onClick={handleUploadVideo}
                >
                  Upload Video
                </Button>
              </div>
            )}

            {videoUrl && (
              <div style={{ marginTop: 12 }}>
                <video src={videoUrl} controls width="400" />
              </div>
            )}
          </div>

          <button type="submit" className="update-button">
            Update News
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default UpdateNews;
