import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, Divider } from '@mui/material';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/courses/${id}/`, { withCredentials: true })
      .then((response) => {
        console.log('Данные курса:', response.data);
        setCourse(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Ошибка загрузки курса: ' + (err.response?.data?.detail || err.message));
        setLoading(false);
      });
  }, [id]);

  const handleBlockClick = (blockId) => {
    window.open(`/block/${blockId}`, '_blank', 'noopener,noreferrer');
  };

  const handleLessonClick = (lessonId) => {
    window.open(`/lesson/${lessonId}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <Typography sx={{ fontSize: '16px', textAlign: 'center', pt: 2 }}>Загрузка...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{ fontSize: '16px', textAlign: 'center', pt: 2 }}>{error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', pt: 2, p: 2 }}>
      {/* Предмет */}
      <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '16px', mb: 1 }}>
        Предмет: {course.subject?.name || 'Не указан'}
      </Typography>

      {/* Название курса */}
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', fontSize: '40px', color: '#333' }}>
        {course.title}
      </Typography>

      {/* Полный текст вводной страницы */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body1"
          sx={{ fontSize: '16px', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: course.full_content || course.description }}
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Блоки курса (только с is_active = true) */}
      {course.blocks && course.blocks.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {course.blocks
            .filter((block) => block.is_active)
            .map((block) => (
              <Box
                key={block.id}
                sx={{
                  width: { xs: '100%', sm: 'calc(50% - 12px)' },
                  position: 'relative',
                  mb: 3,
                  cursor: 'pointer',
                }}
                onClick={() => handleBlockClick(block.id)}
              >
                {/* Картинка блока */}
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    backgroundImage: block.cover ? `url(http://localhost:8000${block.cover})` : 'url(https://via.placeholder.com/375x200)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover .shutter': {
                      transform: 'translateY(0)', // Поднимаем шторку при наведении
                    },
                  }}
                >
                  {/* Шторка с названием и описанием */}
                  <Box
                    className="shutter"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(255, 255, 255, 0.8)', // Белая с прозрачностью
                      color: '#333',
                      p: 2,
                      transform: 'translateY(calc(100% - 48px))', // Изначально видна только часть с названием
                      transition: 'transform 0.3s ease-in-out', // Анимация подъема
                      minHeight: '48px', // Высота для названия
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      borderRadius: '0 0 8px 8px',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'medium', mb: 1 }}>
                      {block.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '14px', lineHeight: 1.4 }}
                      dangerouslySetInnerHTML={{ __html: block.content || 'Краткое содержание отсутствует' }}
                    />
                  </Box>
                </Box>

                {/* Список уроков */}
                <Box sx={{ mt: 2 }}>
                  {block.lessons && block.lessons.length > 0 ? (
                    block.lessons.map((lesson) => (
                      <Typography
                        key={lesson.id}
                        variant="body2"
                        sx={{
                          fontSize: '14px',
                          mb: 1,
                          cursor: 'pointer',
                          color: '#1976d2',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLessonClick(lesson.id);
                        }}
                      >
                        {lesson.title}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                      Уроки отсутствуют
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '16px' }}>
          Активные блоки курса пока не добавлены
        </Typography>
      )}

      {/* Кнопка и информация */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ fontSize: '18px', backgroundColor: '#0066cc', mt: 2 }}
      >
        Начать обучение
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '14px' }}>
        Создатель: {course.owner.username} | Статус: {course.status}
      </Typography>
    </Box>
  );
};

export default CourseDetail;
