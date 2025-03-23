import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import axios from 'axios';

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/lessons/${id}/`, { withCredentials: true })
      .then((response) => {
        setLesson(response.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">{lesson.title}</Typography>
      <Typography dangerouslySetInnerHTML={{ __html: lesson.full_content || lesson.content }} />
    </Box>
  );
};

export default LessonDetail;
