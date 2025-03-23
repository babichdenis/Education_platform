import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LogoutSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Вы успешно вышли
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default LogoutSuccess;
