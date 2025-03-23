import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../screen.png'; // Исправленный путь

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        px: 2,
        pt: 10,
      }}
    >
      {/* Контейнер для картинки */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70vh', // Ограничиваем высоту картинки
          backgroundImage: `url(${backgroundImage})`, // Используем импортированную картинку
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      />
      {/* Затемнение фона */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70vh', // Затемнение только на картинке
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Прозрачный черный фон
          zIndex: 2,
        }}
      />
      {/* Контент */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3, // Контент выше затемнения
          color: '#fff',
          mt: '40vh', // Сдвигаем контент вниз, чтобы он был ниже картинки
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{ fontWeight: 'bold', fontSize: { xs: '36px', sm: '48px' }, mb: 2 }}
        >
          Открой мир знаний с ERUDITE
        </Typography>
        <Typography
          variant="h5"
          sx={{ mb: 4, maxWidth: 600, fontSize: { xs: '18px', sm: '24px' } }}
        >
          Уникальные курсы для каждого: от новичка до эксперта. Учись легко и с удовольствием!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 4, py: 1.5, fontSize: '18px', backgroundColor: '#0066cc' }}
          onClick={() => navigate('/courses')}
        >
          Посмотреть курсы
        </Button>
      </Box>

      {/* Рекламный блок */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#f5f5f5',
          py: 8,
          mt: '3.5vh', // Начинаем после картинки
          zIndex: 4,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}
        >
          Почему выбирают ERUDITE?
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            gap: 4,
            px: 2,
          }}
        >
          {/* Блок 1 */}
          <Box
            sx={{
              maxWidth: 300,
              textAlign: 'center',
              backgroundColor: '#fff',
              borderRadius: '8px',
              p: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              🎓 Профессиональные курсы
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Учитесь у лучших преподавателей и экспертов в своей области.
            </Typography>
          </Box>
          {/* Блок 2 */}
          <Box
            sx={{
              maxWidth: 300,
              textAlign: 'center',
              backgroundColor: '#fff',
              borderRadius: '8px',
              p: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              ⏱️ Гибкий график
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Занимайтесь в удобное для вас время и в своем темпе.
            </Typography>
          </Box>
          {/* Блок 3 */}
          <Box
            sx={{
              maxWidth: 300,
              textAlign: 'center',
              backgroundColor: '#fff',
              borderRadius: '8px',
              p: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              📚 Доступные материалы
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Все учебные материалы доступны онлайн 24/7.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
