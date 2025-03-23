import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';

const AddLesson = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [block, setBlock] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [error, setError] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const navigate = useNavigate();

  // Инициализация редактора tiptap
  const editor = useEditor({
    extensions: [StarterKit],
    content: '', // Начальное содержимое пустое
    onUpdate: ({ editor }) => {
      // Здесь можно добавить обработку изменений, если нужно
    },
  });

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/subjects/', { withCredentials: true })
      .then((response) => setSubjects(response.data))
      .catch((error) => console.error('Ошибка загрузки предметов:', error));

    axios
      .get('http://localhost:8000/api/courses/', { withCredentials: true })
      .then((response) => setCourses(response.data))
      .catch((error) => console.error('Ошибка загрузки курсов:', error));

    axios
      .get('http://localhost:8000/api/lessons/', { withCredentials: true })
      .then((response) => {
        console.log('Уроки:', response.data);
        setLessons(response.data);
      })
      .catch((error) => console.error('Ошибка загрузки уроков:', error));
  }, []);

  useEffect(() => {
    if (course) {
      axios
        .get(`http://localhost:8000/api/courses/${course}/blocks/`, { withCredentials: true })
        .then((response) => setBlocks(response.data))
        .catch((error) => console.error('Ошибка загрузки блоков:', error));
    } else {
      setBlocks([]);
    }
  }, [course]);

  const getCsrfToken = () => {
    return (
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1] || ''
    );
  };

  const filteredCourses = courses.filter((c) => subject && c.subject === parseInt(subject));

  const filteredLessons = lessons
    .filter((lesson) => {
      if (filterActive === 'active') return lesson.is_active === true;
      if (filterActive === 'inactive') return lesson.is_active === false;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  const handleLessonSelect = (lesson) => {
    setSelectedLessonId(lesson.id);
    setTitle(lesson.title);
    setContent(lesson.content || '');
    setCourse(lesson.course ? lesson.course.toString() : '');
    setBlock(lesson.block ? lesson.block.toString() : '');

    const html = lesson.full_content || '';
    if (editor && html) {
      editor.commands.setContent(html); // Загружаем HTML в tiptap
    } else if (editor) {
      editor.commands.setContent(''); // Очищаем, если нет содержимого
    }
  };

  const handleSubmit = async () => {
    try {
      const csrfToken = getCsrfToken();
      const fullContent = editor ? editor.getHTML() : ''; // Получаем HTML из tiptap
      const data = {
        title,
        content,
        full_content: fullContent,
        course: parseInt(course),
        block: block ? parseInt(block) : null,
        order: selectedLessonId ? lessons.find((l) => l.id === selectedLessonId)?.order : lessons.length,
        is_active: true,
      };

      let response;
      if (selectedLessonId) {
        response = await axios.patch(
          `http://localhost:8000/api/lessons/${selectedLessonId}/`,
          data,
          {
            headers: { 'X-CSRFToken': csrfToken },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post('http://localhost:8000/api/lessons/', data, {
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: true,
        });
      }

      const updatedLessons = selectedLessonId
        ? lessons.map((l) => (l.id === selectedLessonId ? response.data : l))
        : [...lessons, response.data];
      setLessons(updatedLessons);
      setError('');
      setTitle('');
      setContent('');
      if (editor) editor.commands.setContent(''); // Очищаем редактор
      setSubject('');
      setCourse('');
      setBlock('');
      setSelectedLessonId(null);
    } catch (error) {
      console.error('Ошибка сохранения урока:', error.response?.data || error);
      setError('Не удалось сохранить урок: ' + (error.response?.data?.detail || 'Ошибка'));
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', p: 2, pt: 10 }}>
      {/* Левая колонка: список всех уроков */}
      <Box sx={{ width: '25%', pr: 2, borderRight: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          Все уроки
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Фильтр</InputLabel>
          <Select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="active">Активные</MenuItem>
            <MenuItem value="inactive">Неактивные</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <List>
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <ListItem
                  key={lesson.id}
                  button
                  selected={selectedLessonId === lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    mb: 1,
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    checked={lesson.is_active}
                    disabled
                    sx={{ mr: 1 }}
                  />
                  <ListItemText
                    primary={lesson.title}
                    secondary={lesson.content}
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>Уроки не найдены</Typography>
            )}
          </List>
        </Box>
      </Box>

      {/* Центральная колонка: название, краткое описание и редактор */}
      <Box sx={{ width: '50%', px: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedLessonId ? 'Редактировать урок' : 'Создать урок'}
        </Typography>
        <TextField
          label="Название урока"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Краткое содержание"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        <Box
          sx={{
            mt: 2,
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: 'calc(100vh - 300px)',
            overflowY: 'auto',
            p: 1,
          }}
        >
          <EditorContent editor={editor} />
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {selectedLessonId ? 'Обновить' : 'Сохранить'}
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Назад
          </Button>
        </Box>
      </Box>

      {/* Правая колонка: назначение урока */}
      <Box sx={{ width: '25%', pl: 2, borderLeft: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          Назначить урок
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Предмет</InputLabel>
          <Select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setCourse('');
              setBlock('');
            }}
          >
            <MenuItem value="">Выберите предмет</MenuItem>
            {subjects.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={!subject}>
          <InputLabel>Курс</InputLabel>
          <Select
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              setBlock('');
            }}
          >
            <MenuItem value="">Выберите курс</MenuItem>
            {filteredCourses.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={!course}>
          <InputLabel>Блок (опционально)</InputLabel>
          <Select value={block} onChange={(e) => setBlock(e.target.value)}>
            <MenuItem value="">Без блока</MenuItem>
            {blocks.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default AddLesson;
