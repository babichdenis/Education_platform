import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Link, CircularProgress } from '@mui/material';
import axios from 'axios';
import '../../index.css';

const LoginForm = ({ isOpen, onRequestClose, onLoginSuccess }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getCsrfToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    let url, payload;
    if (mode === 'login') {
      url = '/_allauth/browser/v1/auth/login';
      payload = { username, password };
    } else if (mode === 'register') {
      url = '/_allauth/browser/v1/auth/signup';
      payload = { username, email, password };
    } else if (mode === 'forgot') {
      url = '/_allauth/browser/v1/auth/password/reset';
      payload = { email };
    }

    try {
      const csrfToken = getCsrfToken();
      await axios.post(url, payload, {
        headers: { 'X-CSRFToken': csrfToken },
        withCredentials: true,
      });

      if (mode === 'login' || mode === 'register') {
        // После входа или регистрации запрашиваем данные сессии для получения isStaff
        const sessionResponse = await axios.get('/api/session/', {
          withCredentials: true,
        });

        if (sessionResponse.data.meta.is_authenticated) {
          const userData = {
            username: sessionResponse.data.user.username,
            isStaff: sessionResponse.data.user.is_staff || false, // Проверяем isStaff
          };
          setUsername('');
          setEmail('');
          setPassword('');
          onLoginSuccess(userData); // Передаём username и isStaff
          onRequestClose();
          navigate('/courses');
        } else {
          setError('Не удалось подтвердить авторизацию');
        }
      } else if (mode === 'forgot') {
        setSuccess('Ссылка для сброса пароля отправлена на ваш email.');
        setEmail('');
      }
    } catch (error) {
      if (error.response?.status === 409 && (mode === 'login' || mode === 'register')) {
        const sessionResponse = await axios.get('/api/session/', {
          withCredentials: true,
        });
        if (sessionResponse.data.meta.is_authenticated) {
          const userData = {
            username: sessionResponse.data.user.username,
            isStaff: sessionResponse.data.user.is_staff || false,
          };
          setUsername('');
          setEmail('');
          setPassword('');
          onLoginSuccess(userData);
          onRequestClose();
          navigate('/courses');
        }
      } else {
        setError(error.response?.data?.detail || 'Ошибка. Проверьте данные и попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Box className="modal-overlay">
      <Box className="modal-content" sx={{ display: 'flex', width: '450px' }}>
        <Box sx={{ flex: 2, pr: 2 }}>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontFamily: 'Arial, sans-serif', color: '#333' }}
            >
              {mode === 'login' ? 'Вход' : mode === 'register' ? 'Регистрация' : 'Сброс пароля'}
            </Typography>

            {mode !== 'forgot' && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            )}

            {(mode === 'register' || mode === 'forgot') && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            )}

            {mode !== 'forgot' && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            )}

            {error && (
              <Typography color="error" sx={{ fontFamily: 'Arial, sans-serif', color: '#ff0000' }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography
                color="success.main"
                sx={{ fontFamily: 'Arial, sans-serif', color: '#00cc00' }}
              >
                {success}
              </Typography>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid #007bff',
                  color: '#007bff',
                }}
                onMouseOver={(e) => (e.target.style.borderColor = '#0056b3')}
                onMouseOut={(e) => (e.target.style.borderColor = '#007bff')}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: '#007bff' }} />
                ) : mode === 'login' ? (
                  'Войти'
                ) : mode === 'register' ? (
                  'Зарегистрироваться'
                ) : (
                  'Сбросить пароль'
                )}
              </button>
              <button
                type="button"
                onClick={onRequestClose}
                disabled={loading}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid #007bff',
                  color: '#007bff',
                }}
                onMouseOver={(e) => (e.target.style.borderColor = '#0056b3')}
                onMouseOut={(e) => (e.target.style.borderColor = '#007bff')}
              >
                Закрыть
              </button>
            </Box>

            <Box sx={{ mt: 2 }}>
              {mode === 'login' && (
                <>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode('register');
                      setError('');
                      setSuccess('');
                    }}
                    sx={{
                      cursor: 'pointer',
                      mr: 2,
                      fontFamily: 'Arial, sans-serif',
                      color: '#007bff',
                    }}
                  >
                    Нет аккаунта? Зарегистрируйтесь
                  </Link>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode('forgot');
                      setError('');
                      setSuccess('');
                    }}
                    sx={{ cursor: 'pointer', fontFamily: 'Arial, sans-serif', color: '#007bff' }}
                  >
                    Забыли пароль?
                  </Link>
                </>
              )}
              {mode === 'register' && (
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode('login');
                    setError('');
                    setSuccess('');
                  }}
                  sx={{ cursor: 'pointer', fontFamily: 'Arial, sans-serif', color: '#007bff' }}
                >
                  Уже есть аккаунт? Войдите
                </Link>
              )}
              {mode === 'forgot' && (
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode('login');
                    setError('');
                    setSuccess('');
                  }}
                  sx={{ cursor: 'pointer', fontFamily: 'Arial, sans-serif', color: '#007bff' }}
                >
                  Вернуться ко входу
                </Link>
              )}
            </Box>
          </form>
        </Box>
        <Box
          sx={{
            flex: 1,
            pl: 2,
            borderLeft: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontFamily: 'Arial, sans-serif', color: '#333', mb: 2 }}
          >
            {mode === 'login' && 'Введите свои данные для входа в систему.'}
            {mode === 'register' && 'Создайте аккаунт, чтобы начать обучение.'}
            {mode === 'forgot' && 'Укажите email для восстановления пароля.'}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'Arial, sans-serif', color: '#666' }}>
            Если возникли проблемы, свяжитесь с поддержкой.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
