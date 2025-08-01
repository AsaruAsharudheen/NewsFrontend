import { Button, Drawer } from 'antd';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const navItems = [
    { label: 'Home', icon: 'fa-house', path: '/' },
    { label: 'Business', icon: 'fa-briefcase', path: '/business' },
    { label: 'Health', icon: 'fa-heart-pulse', path: '/health' },
    { label: 'Politics', icon: 'fa-landmark-flag', path: '/politics' },
    { label: 'Education', icon: 'fa-shirt', path: '/education' },
    { label: 'Sports', icon: 'fa-futbol', path: '/sports' },
    { label: 'Food', icon: 'fa-utensils', path: '/food' },
    { label: 'Books', icon: 'fa-book', path: '/books' },
    { label: 'Opinion', icon: 'fa-comment-dots', path: '/opinion' },
    { label: 'Pravasi', icon: 'fa-plane-departure', path: '/pravasi' },
    { label: 'Culture', icon: 'fa-mask-theater', path: '/culture' },
    { label: 'Women', icon: 'fa-venus', path: '/women' },
  ];

  const handleNavigate = path => {
    navigate(path);
    setOpen(false); // Close drawer
  };

  return (
    <div className="fixed-navbar-container">
      {/* ===== Mobile Top Bar ===== */}
      <div className="mobile-topbar">
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>
          NEWSIFY
        </h1>
        <Button className="subscribe-btn">Sign Up</Button>
        <MenuOutlined
          className="hamburger-icon"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* ===== Desktop Header ===== */}
      <div className="navbar-heading">
        <div className="navbar-date">{today}</div>
        <div className="navbar-title">
          <h1>
            <span className="black">NEWSIFY</span>
          </h1>
        </div>
        <Button
          onClick={() => navigate('/admin/login')}
          className="add-news-btn"
        >
          <i className="fa-solid fa-user-tie"></i>
        </Button>
      </div>

      {/* ===== Desktop Nav Bar ===== */}
      <div className="nav-bar desktop-only">
        {navItems.map(item => (
          <p key={item.label} onClick={() => handleNavigate(item.path)}>
            <i className={`fa-solid ${item.icon}`}></i> {item.label}
          </p>
        ))}
      </div>

      {/* ===== Mobile Drawer ===== */}
      <Drawer
        placement="right"
        closable
        onClose={() => setOpen(false)}
        open={open}
        className="mobile-drawer"
        width={250}
      >
        {/* Sign In + Search */}
       

        {/* Menu Links */}
        <div className="drawer-links-list">
          {navItems.map(item => (
            <p
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className="drawer-link"
            >
              <i className={`fa-solid ${item.icon}`}></i> {item.label}
            </p>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
