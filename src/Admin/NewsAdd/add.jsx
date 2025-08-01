import React, { useState } from 'react';
import {
  Form,
  Input,
  Upload,
  Button,
  Card,
  message,
  Select,
  Modal,
} from 'antd';
import {
  UploadOutlined,
  CloudUploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../Components/AdminLayout/layout';
import './add.css';

const { Option } = Select;

const BASE_URL = 'https://newsbackend-73b7.onrender.com';

const Add = () => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const beforeUploadImage = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Only image files are allowed!');
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => [
        ...prev,
        {
          raw: e.target.result,
          file,
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
        },
      ]);
    };
    reader.readAsDataURL(file);
    return false; // Prevent auto upload
  };

  const handleUploadOne = async (index) => {
    const preview = previews[index];
    if (!preview?.file) return;

    const formData = new FormData();
    formData.append('images', preview.file);

    try {
      const res = await axios.post(`${BASE_URL}/api/upload`, formData);
      const uploadedUrl = res.data.urls?.[0] || res.data.url;
      setUploadedUrls((prev) => [...prev, uploadedUrl]);
      message.success(`Image ${index + 1} uploaded!`);
    } catch (err) {
      console.error(err);
      message.error('Image upload failed.');
    }
  };

  const beforeUploadVideo = (file) => {
    if (!file.type.startsWith('video/')) {
      message.error('Only video files are allowed!');
      return Upload.LIST_IGNORE;
    }
    setVideoFile(file);
    message.success(`Selected video: ${file.name}`);
    return false; // Prevent auto upload
  };

  const handleUploadVideo = async () => {
    if (!videoFile) {
      return message.warning('Please select a video first.');
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const res = await axios.post(`${BASE_URL}/api/uploadVideo`, formData);
      setVideoUrl(res.data.url);
      message.success('Video uploaded successfully!');
    } catch (err) {
      console.error(err);
      message.error('Video upload failed.');
    }
  };

  const onFinish = async (values) => {
    if (uploadedUrls.length === 0) {
      return message.warning('Please upload at least one image.');
    }

    const payload = {
      ...values,
      images: uploadedUrls,
      video: videoUrl,
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/News`, payload);
      message.success('News added successfully!');
      navigate('/admin/list');
    } catch (err) {
      console.error(err);
      message.error('Failed to add news.');
    } finally {
      setLoading(false);
    }
  };

  const updatePreviewControl = (index, key, value) => {
    setPreviews((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [key]: value } : item
      )
    );
  };

  return (
    <AdminLayout>
      <div className="add-container">
        <Card title="Add News" bordered={false} className="add-card">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter a title.' }]}
            >
              <Input placeholder="Enter news title" />
            </Form.Item>

            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: 'Please enter content.' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter full content" />
            </Form.Item>

            <Form.Item
              label="Summary"
              name="summary"
              rules={[{ required: true, message: 'Please enter a summary.' }]}
            >
              <Input.TextArea rows={2} placeholder="Short summary" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select placeholder="Select a category">
                <Option value="sports">Sports</Option>
                <Option value="health">Health</Option>
                <Option value="education">Education</Option>
                <Option value="business">Business</Option>
                <Option value="politics">Politics</Option>
                <Option value="food">Food</Option>
                <Option value="women">Women</Option>
                <Option value="pravasi">Pravasi</Option>
                <Option value="culture">Culture</Option>
                <Option value="opinion">Opinion</Option>
                <Option value="books">Books</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Upload Images" required>
              <Upload
                beforeUpload={beforeUploadImage}
                showUploadList={false}
                accept="image/*"
                multiple
              >
                <Button icon={<UploadOutlined />}>Choose Images</Button>
              </Upload>

              {previews.length > 0 && (
                <div className="previews-list">
                  {previews.map((preview, index) => (
                    <div key={index} className="preview-item">
                      <div className="preview-frame">
                        <div
                          style={{
                            transform: `scale(${preview.zoom}) translate(${preview.offsetX}px, ${preview.offsetY}px)`,
                          }}
                        >
                          <img src={preview.raw} alt={`Preview ${index}`} />
                        </div>
                      </div>

                      <div className="preview-controls">
                        <div>
                          <label>Zoom:</label>
                          <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.01"
                            value={preview.zoom}
                            onChange={(e) =>
                              updatePreviewControl(
                                index,
                                'zoom',
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div>
                          <label>Left / Right:</label>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={preview.offsetX}
                            onChange={(e) =>
                              updatePreviewControl(
                                index,
                                'offsetX',
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div>
                          <label>Up / Down:</label>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={preview.offsetY}
                            onChange={(e) =>
                              updatePreviewControl(
                                index,
                                'offsetY',
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      <Button
                        type="primary"
                        icon={<CloudUploadOutlined />}
                        onClick={() => handleUploadOne(index)}
                        style={{ marginTop: 10 }}
                      >
                        Upload Image {index + 1}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Form.Item>

            <Form.Item label="Upload Video">
              <Upload
                beforeUpload={beforeUploadVideo}
                showUploadList={false}
                accept="video/*"
              >
                <Button icon={<VideoCameraOutlined />}>Choose Video</Button>
              </Upload>

              {videoFile && (
                <Button
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  onClick={handleUploadVideo}
                  style={{ marginTop: 10 }}
                >
                  Upload Video
                </Button>
              )}

              {videoUrl && (
                <Button
                  type="primary"
                  icon={<VideoCameraOutlined />}
                  style={{
                    backgroundColor: '#2a53c1',
                    border: 'none',
                    marginTop: 10,
                  }}
                  onClick={() => setIsVideoModalVisible(true)}
                >
                  Play Uploaded Video
                </Button>
              )}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Submit News
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Modal
          open={isVideoModalVisible}
          footer={null}
          onCancel={() => setIsVideoModalVisible(false)}
          width={800}
          centered
        >
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Add;
