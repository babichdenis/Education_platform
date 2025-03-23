import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.js';
import Home from '../components/Home.js';
import Courses from '../components/courses/Courses.js';
import CourseDetail from '../components/courses/CourseDetail.js';
import LessonDetail from '../components/courses/LessonDetail.js'; // Добавляем LessonDetail
import AddCourse from '../components/courses/AddCourse.js';
import AddLesson from '../components/courses/AddLesson.js';
import EditFullContent from '../components/courses/EditFullContent.js';
import LogoutSuccess from '../components/auth/LogoutSuccess.js';
import NotFound from '../components/NotFound.js';

const News = () => <div>Новости (TBD)</div>;
const AddNews = () => <div>Создать новости (TBD)</div>;

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/session/', {
          withCredentials: true,
        });
        if (response.data.meta && response.data.meta.is_authenticated) {
          setIsAuthenticated(true);
          setUsername(response.data.user?.username || 'User');
          setIsStaff(response.data.user?.is_staff || false);
        } else {
          setIsAuthenticated(false);
          setUsername('');
          setIsStaff(false);
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        setIsAuthenticated(false);
        setUsername('');
        setIsStaff(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        username={username}
        setUsername={setUsername}
        isStaff={isStaff}
        setIsStaff={setIsStaff}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout-success" element={<LogoutSuccess />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/lesson/:id" element={<LessonDetail />} /> {/* Добавляем маршрут для LessonDetail */}
        <Route path="/news" element={<News />} />

        {isAuthenticated ? (
          <>
            {isStaff ? (
              <>
                <Route path="/add-course" element={<AddCourse isAuthenticated={isAuthenticated} />} />
                <Route
                  path="/add-course/:courseId"
                  element={<AddCourse isAuthenticated={isAuthenticated} />}
                />
                <Route path="/add-lesson" element={<AddLesson />} />
                <Route path="/add-news" element={<AddNews />} />
                <Route
                  path="/edit-full-content/:type/:courseId/:index?"
                  element={<EditFullContent />}
                />
              </>
            ) : (
              <>
                <Route path="/add-course" element={<NotFound />} />
                <Route path="/add-course/:courseId" element={<NotFound />} />
                <Route path="/add-lesson" element={<NotFound />} />
                <Route path="/add-news" element={<NotFound />} />
                <Route path="/edit-full-content/:type/:courseId/:index?" element={<NotFound />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/add-course" element={<NotFound />} />
            <Route path="/add-course/:courseId" element={<NotFound />} />
            <Route path="/add-lesson" element={<NotFound />} />
            <Route path="/add-news" element={<NotFound />} />
            <Route path="/edit-full-content/:type/:courseId/:index?" element={<NotFound />} />
            <Route path="/news" element={<NotFound />} />
          </>
        )}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
