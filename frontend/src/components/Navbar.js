import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './auth/LoginForm.js';

const Navbar = ({ isAuthenticated, setIsAuthenticated, username, setUsername, isStaff }) => {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);

  const getCsrfToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '';
  };

  const handleLogout = async () => {
    try {
      const csrfToken = getCsrfToken();
      await axios.post('http://localhost:8000/api/logout/', {}, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      setIsAuthenticated(false);
      setUsername('');
      navigate('/logout-success');
    } catch (error) {
      console.error('Ошибка выхода:', error);
      alert('Не удалось выйти: ' + (error.response?.data?.message || 'Ошибка сервера'));
    }
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUsername(userData.username || 'User');
    setLoginOpen(false);
    navigate('/courses');
  };

  const navbarHeight = 80; // Высота навбара (взята из стилей)

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: `${navbarHeight}px`, // Высота навбара
          justifyContent: 'center',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              fontSize: '28px',
              color: '#000',
              fontFamily: 'Arial, sans-serif',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            ERUDITE
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              sx={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '20px',
                textTransform: 'none',
                color: '#000',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  color: '#000',
                  '&::after': {
                    transform: 'scaleX(1)',
                    transformOrigin: 'left',
                  },
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#000',
                  transform: 'scaleX(0)',
                  transformOrigin: 'right',
                  transition: 'transform 0.3s ease-in-out',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: '2px solid transparent',
                  borderRadius: '4px',
                  transition: 'border-color 0.3s ease-in-out',
                },
                '&:hover::before': {
                  borderColor: '#000',
                },
              }}
              onClick={() => navigate('/courses')}
            >
              Курсы
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '20px',
                    textTransform: 'none',
                    color: '#000',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      color: '#000',
                      '&::after': {
                        transform: 'scaleX(1)',
                        transformOrigin: 'left',
                      },
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#000',
                      transform: 'scaleX(0)',
                      transformOrigin: 'right',
                      transition: 'transform 0.3s ease-in-out',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: '2px solid transparent',
                      borderRadius: '4px',
                      transition: 'border-color 0.3s ease-in-out',
                    },
                    '&:hover::before': {
                      borderColor: '#000',
                    },
                  }}
                  onClick={() => navigate('/news')}
                >
                  Новости
                </Button>
                {isStaff && (
                  <>
                    <Button
                      sx={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '20px',
                        textTransform: 'none',
                        color: '#000',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          color: '#000',
                          '&::after': {
                            transform: 'scaleX(1)',
                            transformOrigin: 'left',
                          },
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          backgroundColor: '#000',
                          transform: 'scaleX(0)',
                          transformOrigin: 'right',
                          transition: 'transform 0.3s ease-in-out',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: '2px solid transparent',
                          borderRadius: '4px',
                          transition: 'border-color 0.3s ease-in-out',
                        },
                        '&:hover::before': {
                          borderColor: '#000',
                        },
                      }}
                      onClick={() => navigate('/add-course')}
                    >
                      Создать курс
                    </Button>
                    <Button
                      sx={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '20px',
                        textTransform: 'none',
                        color: '#000',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          color: '#000',
                          '&::after': {
                            transform: 'scaleX(1)',
                            transformOrigin: 'left',
                          },
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          backgroundColor: '#000',
                          transform: 'scaleX(0)',
                          transformOrigin: 'right',
                          transition: 'transform 0.3s ease-in-out',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: '2px solid transparent',
                          borderRadius: '4px',
                          transition: 'border-color 0.3s ease-in-out',
                        },
                        '&:hover::before': {
                          borderColor: '#000',
                        },
                      }}
                      onClick={() => navigate('/add-lesson')}
                    >
                      Создать урок
                    </Button>
                    <Button
                      sx={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '20px',
                        textTransform: 'none',
                        color: '#000',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          color: '#000',
                          '&::after': {
                            transform: 'scaleX(1)',
                            transformOrigin: 'left',
                          },
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          backgroundColor: '#000',
                          transform: 'scaleX(0)',
                          transformOrigin: 'right',
                          transition: 'transform 0.3s ease-in-out',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: '2px solid transparent',
                          borderRadius: '4px',
                          transition: 'border-color 0.3s ease-in-out',
                        },
                        '&:hover::before': {
                          borderColor: '#000',
                        },
                      }}
                      onClick={() => navigate('/add-news')}
                    >
                      Создать новости
                    </Button>
                  </>
                )}
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    mx: 2,
                    color: '#000',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '20px',
                    alignSelf: 'center',
                  }}
                >
                  {username}
                </Typography>
                <Button
                  sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '20px',
                    textTransform: 'none',
                    color: '#000',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      color: '#000',
                      '&::after': {
                        transform: 'scaleX(1)',
                        transformOrigin: 'left',
                      },
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#000',
                      transform: 'scaleX(0)',
                      transformOrigin: 'right',
                      transition: 'transform 0.3s ease-in-out',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: '2px solid transparent',
                      borderRadius: '4px',
                      transition: 'border-color 0.3s ease-in-out',
                    },
                    '&:hover::before': {
                      borderColor: '#000',
                    },
                  }}
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <Button
                sx={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '20px',
                  textTransform: 'none',
                  color: '#000',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    color: '#000',
                    '&::after': {
                      transform: 'scaleX(1)',
                      transformOrigin: 'left',
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#000',
                    transform: 'scaleX(0)',
                    transformOrigin: 'right',
                    transition: 'transform 0.3s ease-in-out',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: '2px solid transparent',
                    borderRadius: '4px',
                    transition: 'border-color 0.3s ease-in-out',
                  },
                  '&:hover::before': {
                    borderColor: '#000',
                  },
                }}
                onClick={() => setLoginOpen(true)}
              >
                Войти
              </Button>
            )}
          </Box>
        </Toolbar>
        <LoginForm
          isOpen={loginOpen}
          onRequestClose={() => setLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </AppBar>
      {/* Spacer для отталкивания содержимого */}
      <Box sx={{ height: `${navbarHeight}px` }} />
    </>
  );
};

export default Navbar;
