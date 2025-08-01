import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/home';
import Add from './Admin/NewsAdd/add';
import Sports from './Components/Sports/sports';
import Health from './Components/Health/health';
import Politics from './Components/Politics/politics';
import Business from './Components/Business/business';
import List from './Admin/Newslist/list';
import AdminLayout from './Components/AdminLayout/layout';
import News from './Components/News/news';
import AdminLogin from './Admin/Login/login';
import UpdateNews from './Admin/UpdateNews/update';
import Navbar from './Components/Navbar/navbar';
import Education from './Components/Education/education';
import Books from './Components/Books/books';
import Culture from './Components/Culture/culture';
import Food from './Components/Food/food';
import Opinion from './Components/Opinion/opinion';
import Pravasi from './Components/Pravasi/pravasi';
import Women from './Components/Women/women';
// import UpdateNews from './Admin/UpdateNews/update';
// import PrivateRoute from './Components/PrivateRoute';

const App = () => {
  return (
    <>
      <Routes>
        {/* <Route path="/admin" element={<PrivateRoute />}> */}
        <Route path="/admin/Add" element={<Add />} />
        <Route path="/admin/list" element={<List />} />
        {/* </Route> */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/Login" element={<AdminLogin />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/health" element={<Health />} />
        <Route path="/politics" element={<Politics />} />
        <Route path="/education" element={<Education />} />
        <Route path="/business" element={<Business />} />
        <Route path="/books" element={<Books />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/food" element={<Food />} />
        <Route path="/opinion" element={<Opinion />} />
        <Route path="/pravasi" element={<Pravasi />} />
        <Route path="/women" element={<Women />} />

        <Route path="/adminLayout" element={<AdminLayout />} />
        <Route path="/News/:id" element={<News />} />
        <Route path="/update/:id" element={<UpdateNews />} />

        {/* <Route path='/Update' element={<UpdateNews/>}/> */}
      </Routes>
    </>
  );
};

export default App;
