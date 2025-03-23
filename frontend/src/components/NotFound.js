import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '72px', fontWeight: 'bold', color: '#d32f2f', mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ fontSize: '24px', mb: 2 }}>
        Страница не найдена
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '16px', mb: 4, color: 'text.secondary' }}>
        Извините, запрашиваемая страница не существует.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ fontSize: '16px', px: 4, py: 1 }}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default NotFound;
