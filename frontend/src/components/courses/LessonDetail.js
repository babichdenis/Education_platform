import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('LessonDetail: Загрузка урока с ID:', id);
    axios
      .get(`/api/lessons/${id}/`, { withCredentials: true })
      .then((response) => {
        console.log('LessonDetail: Данные урока:', response.data);
        setLesson(response.data);
        return axios.get(`/api/courses/${response.data.course}/`, { withCredentials: true });
      })
      .then((courseResponse) => {
        console.log('LessonDetail: Данные курса:', courseResponse.data);
        setCourse(courseResponse.data);
        const lessons = courseResponse.data.blocks
          .filter((block) => block.is_active)
          .flatMap((block) => block.lessons || []);
        setAllLessons(lessons);
        const lessonIndex = lessons.findIndex((l) => l.id === parseInt(id));
        console.log('LessonDetail: Индекс урока:', lessonIndex, 'Все уроки:', lessons);
        if (lessonIndex === -1) {
          navigate('/404', { replace: true });
        } else {
          setCurrentLessonIndex(lessonIndex);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('LessonDetail: Ошибка:', err);
        setError('Ошибка загрузки урока: ' + (err.response?.data?.detail || err.message));
        setLoading(false);
        if (err.response?.status === 404) {
          navigate('/404', { replace: true });
        }
      });
  }, [id, navigate]);

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLessonId = allLessons[currentLessonIndex - 1].id;
      navigate(`/lesson/${previousLessonId}`);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLessonId = allLessons[currentLessonIndex + 1].id;
      navigate(`/lesson/${nextLessonId}`);
    }
  };

  if (loading) {
    return <Typography sx={{ fontSize: '16px', textAlign: 'center', pt: 2 }}>Загрузка...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{ fontSize: '16px', textAlign: 'center', pt: 2 }}>{error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handlePreviousLesson}
          disabled={currentLessonIndex <= 0}
        >
          Предыдущий урок
        </Button>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNextLesson}
          disabled={currentLessonIndex >= allLessons.length - 1}
        >
          Следующий урок
        </Button>
      </Box>

      <Typography variant="h4" sx={{ fontSize: '28px', fontWeight: 'bold', mb: 2 }}>
        {lesson.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontSize: '16px', lineHeight: 1.6, mb: 4 }}
        dangerouslySetInnerHTML={{
          __html: lesson.full_content || lesson.content || 'Содержание урока отсутствует',
        }}
      />

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handlePreviousLesson}
          disabled={currentLessonIndex <= 0}
        >
          Предыдущий урок
        </Button>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNextLesson}
          disabled={currentLessonIndex >= allLessons.length - 1}
        >
          Следующий урок
        </Button>
      </Box>
    </Box>
  );
};

export default LessonDetail;
