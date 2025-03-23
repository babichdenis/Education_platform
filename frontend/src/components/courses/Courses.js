import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/courses/', { withCredentials: true })
      .then(response => setCourses(response.data))
      .catch(error => console.error('Ошибка загрузки курсов:', error));
  }, []);

  const handleEdit = (courseId) => {
    navigate(`/add-course/${courseId}`);
  };

  const handleDetails = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', pt: 10, p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Откройте мир знаний с нашими курсами
      </Typography>
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              {/* Обложка курса */}
              <Box
                sx={{
                  width: '375px', // 300px * 1.25 = 375px
                  height: '375px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {course.cover ? (
                  <img
                    src={`${course.cover}`}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Нет обложки
                  </Typography>
                )}
              </Box>

              {/* Контент */}
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {course.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {course.description || 'Погрузитесь в увлекательное путешествие по миру знаний с этим курсом!'}
                </Typography>

                {/* Кнопки */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleDetails(course.id)}
                    sx={{
                      flex: 1,
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.5)',
                        borderColor: '#1976d2',
                        color: '#fff',
                      },
                    }}
                  >
                    Подробнее
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(course.id)}
                    sx={{
                      flex: 1,
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.5)',
                        borderColor: '#1976d2',
                        color: '#fff',
                      },
                    }}
                  >
                    Редактировать
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Courses;
