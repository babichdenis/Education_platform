import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';

const RichTextEditor = ({ content, onContentChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content || '');
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        minHeight: '200px',
        overflowY: 'auto',
        p: 1,
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

const AddCourse = ({ isAuthenticated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [sortSubject, setSortSubject] = useState('');
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/subjects/', { withCredentials: true })
      .then((response) => setSubjects(response.data))
      .catch((error) => console.error('Ошибка загрузки предметов:', error));

    axios
      .get('http://localhost:8000/api/courses/', { withCredentials: true })
      .then((response) => setCourses(response.data))
      .catch((error) => console.error('Ошибка загрузки курсов:', error));

    if (courseId) {
      axios
        .get(`http://localhost:8000/api/courses/${courseId}/`, { withCredentials: true })
        .then((response) => {
          const course = response.data;
          setTitle(course.title);
          setDescription(course.description);
          setSubject(course.subject);
          setCoverPreview(course.cover ? `http://localhost:8000${course.cover}` : null);
          setBlocks(
            course.blocks.map((block) => ({
              id: block.id,
              title: block.title,
              content: block.content,
              cover: null,
              coverPreview: block.cover ? `http://localhost:8000${block.cover}` : null,
              expanded: true,
              is_active: block.is_active !== undefined ? block.is_active : true,
              isNew: false, // Флаг для новых блоков
            })),
          );
          setLessons(course.lessons || []);
          setSelectedCourseId(course.id);
          console.log('Loaded lessons:', course.lessons);
        })
        .catch((error) => console.error('Ошибка загрузки курса:', error));
    } else {
      setBlocks([
        { id: Date.now(), title: '', content: '', cover: null, coverPreview: null, expanded: true, is_active: true, isNew: true },
      ]);
    }
  }, [courseId]);

  const getCsrfToken = () => {
    return (
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1] || ''
    );
  };

  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[index][field] = value;
    if (field === 'cover' && value) newBlocks[index].coverPreview = URL.createObjectURL(value);
    setBlocks(newBlocks);
  };

  const handleContentChange = (blockId, newContent) => {
    const newBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, content: newContent } : block
    );
    setBlocks(newBlocks);
  };

  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription);
  };

  const toggleBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks[index].expanded = !newBlocks[index].expanded;
    setBlocks(newBlocks);
  };

  const addBlock = () => {
    setBlocks([
      ...blocks,
      { id: Date.now(), title: '', content: '', cover: null, coverPreview: null, expanded: true, is_active: true, isNew: true },
    ]);
  };

  const removeBlock = (index) => {
    const block = blocks[index];
    const attachedLessons = lessons.filter((l) => l.block === (block.id || `block-${index}`));
    const confirmMessage = attachedLessons.length > 0
      ? `К этому блоку прикреплено ${attachedLessons.length} уроков. Вы точно хотите удалить блок?`
      : 'Вы точно хотите удалить этот блок?';
    
    if (window.confirm(confirmMessage)) {
      setBlocks(blocks.filter((_, i) => i !== index));
    }
  };

  const handleToggleBlockActive = (index) => {
    const newBlocks = [...blocks];
    newBlocks[index].is_active = !newBlocks[index].is_active;
    setBlocks(newBlocks);
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleBlockCoverDrop = (index, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleBlockChange(index, 'cover', file);
  };

  const handleCourseSelect = (courseId) => navigate(`/add-course/${courseId}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = getCsrfToken();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('subject', subject);
      if (cover) formData.append('cover', cover);

      let newCourseId;
      if (courseId) {
        const response = await axios.put(
          `http://localhost:8000/api/courses/${courseId}/`,
          formData,
          {
            headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          },
        );
        newCourseId = response.data.id;
      } else {
        const response = await axios.post('http://localhost:8000/api/courses/', formData, {
          headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        newCourseId = response.data.id;
      }

      // Обновление или создание блоков
      const updatedBlocks = [];
      for (const block of blocks) {
        const blockFormData = new FormData();
        blockFormData.append('title', block.title);
        blockFormData.append('content', block.content);
        blockFormData.append('course', newCourseId);
        blockFormData.append('is_active', block.is_active);
        if (block.cover) blockFormData.append('cover', block.cover);

        if (block.isNew) { // Новый блок
          const response = await axios.post(
            `http://localhost:8000/api/courses/${newCourseId}/blocks/`,
            blockFormData,
            {
              headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'multipart/form-data' },
              withCredentials: true,
            },
          );
          updatedBlocks.push({ ...block, id: response.data.id, isNew: false });
        } else { // Обновление существующего блока через PATCH
          await axios.patch(
            `http://localhost:8000/api/blocks/${block.id}/`,
            blockFormData,
            {
              headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'multipart/form-data' },
              withCredentials: true,
            },
          );
          updatedBlocks.push(block);
        }
      }
      setBlocks(updatedBlocks); // Обновляем состояние с реальными ID

      // Удаление блоков, которые больше не существуют
      const existingBlockIds = updatedBlocks.map((b) => b.id).filter((id) => id && !isNaN(id));
      const serverBlocks = (await axios.get(`http://localhost:8000/api/courses/${newCourseId}/blocks/`, { withCredentials: true })).data;
      for (const serverBlock of serverBlocks) {
        if (!existingBlockIds.includes(serverBlock.id)) {
          await axios.delete(`http://localhost:8000/api/blocks/${serverBlock.id}/`, {
            headers: { 'X-CSRFToken': csrfToken },
            withCredentials: true,
          });
        }
      }

      // Обновление уроков
      for (const lesson of lessons) {
        await axios.patch(
          `http://localhost:8000/api/lessons/${lesson.id}/`,
          {
            block: lesson.block,
            order: lesson.order,
            is_active: lesson.is_active,
          },
          {
            headers: { 'X-CSRFToken': csrfToken },
            withCredentials: true,
          },
        );
      }

      alert('Курс успешно сохранен!');
    } catch (error) {
      console.error('Ошибка:', error.response?.data || error);
      alert('Не удалось сохранить курс: ' + (error.response?.data?.detail || 'Ошибка'));
    }
  };

  const handleDeleteCourse = async () => {
    if (courseId && window.confirm('Удалить курс?')) {
      try {
        const csrfToken = getCsrfToken();
        await axios.delete(`http://localhost:8000/api/courses/${courseId}/`, {
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: true,
        });
        navigate('/courses');
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить курс');
      }
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceBlockId = source.droppableId;
    const destBlockId = destination.droppableId;

    const updatedLessons = [...lessons];
    const [movedLesson] = updatedLessons.splice(source.index, 1);
    updatedLessons.splice(destination.index, 0, movedLesson);

    if (sourceBlockId !== destBlockId) {
      movedLesson.block = destBlockId === 'undefined' || !destBlockId ? null : parseInt(destBlockId);
    }

    updatedLessons.forEach((lesson, index) => {
      lesson.order = index;
    });

    setLessons(updatedLessons);
  };

  const handleToggleActive = (lessonId, isActive) => {
    const updatedLessons = lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, is_active: isActive } : lesson
    );
    setLessons(updatedLessons);
  };

  const filteredCourses = sortSubject
    ? courses.filter((course) => course.subject === sortSubject)
    : courses;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', p: 2, pt: 10 }}>
      <Box sx={{ width: '25%', pr: 2, borderRight: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          Все курсы
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Сортировать по предмету</InputLabel>
          <Select value={sortSubject} onChange={(e) => setSortSubject(e.target.value)}>
            <MenuItem value="">Все предметы</MenuItem>
            {subjects.map((subj) => (
              <MenuItem key={subj.id} value={subj.id}>
                {subj.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {filteredCourses.map((course) => (
            <Box
              key={course.id}
              sx={{
                p: 1,
                mb: 1,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedCourseId === course.id ? '#f0f0f0' : 'inherit',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
              onClick={() => handleCourseSelect(course.id)}
            >
              <Typography variant="body1">{course.title}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ width: '75%', pl: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ width: '50%' }}>
            <InputLabel>Предмет</InputLabel>
            <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {subjects.map((subj) => (
                <MenuItem key={subj.id} value={subj.id}>
                  {subj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ width: '50%', display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSubmit} sx={{ flex: 1 }}>
              Сохранить
            </Button>
            {courseId && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteCourse}
                sx={{ flex: 1 }}
              >
                Удалить курс
              </Button>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            p: 2,
            mb: 2,
            display: 'flex',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 2, position: 'relative' }}>
            <Typography
              variant="body2"
              sx={{ position: 'absolute', top: 8, left: 8, color: '#888' }}
            >
              Курс
            </Typography>
            <TextField
              label="Название курса"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              Краткое описание (для страницы курсов)
            </Typography>
            <RichTextEditor content={description} onContentChange={handleDescriptionChange} />
            <Button
              variant="text"
              onClick={() => title && navigate(`/edit-full-content/course/${courseId || 'new'}`)}
              disabled={!title}
              sx={{ mt: 1 }}
            >
              Полный текст вводной страницы курса
            </Button>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                width: '375px',
                height: '375px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
              }}
              onDrop={handleCoverDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('course-cover-input').click()}
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Превью обложки"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              ) : (
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  Обложка курса (375x375 px)
                  <br />
                  Перетащите сюда картинку или кликните
                </Typography>
              )}
            </Box>
            <input
              id="course-cover-input"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              style={{ display: 'none' }}
            />
          </Box>
        </Box>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Блоки
          </Typography>
          {blocks.map((block, index) => (
            <Box key={block.id || `block-${index}`} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => removeBlock(index)}
                      sx={{ '&:hover': { borderColor: '#ff605c', color: '#ff605c' } }}
                    >
                      Удалить
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={block.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      onClick={() => toggleBlock(index)}
                      sx={{ '&:hover': { borderColor: '#ffbd44', color: '#ffbd44' } }}
                    >
                      {block.expanded ? 'Свернуть' : 'Развернуть'}
                    </Button>
                    <Checkbox
                      checked={block.is_active}
                      onChange={() => handleToggleBlockActive(index)}
                      sx={{ ml: 1 }}
                    />
                    <Typography variant="body2">Показывать</Typography>
                  </Box>
                  <TextField
                    label="Название блока"
                    value={block.title}
                    onChange={(e) => handleBlockChange(index, 'title', e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  {block.expanded && (
                    <>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Краткое содержание
                      </Typography>
                      <RichTextEditor content={block.content} onContentChange={(newContent) => handleContentChange(block.id, newContent)} />
                      <Button
                        variant="text"
                        onClick={() =>
                          block.title &&
                          navigate(`/edit-full-content/block/${courseId || 'new'}/${index}`)
                        }
                        disabled={!block.title}
                        sx={{ mt: 1 }}
                      >
                        Полный текст вводной страницы блока
                      </Button>
                    </>
                  )}
                </Box>
                {block.expanded && (
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        width: '375px',
                        height: '375px',
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        cursor: 'pointer',
                      }}
                      onDrop={(e) => handleBlockCoverDrop(index, e)}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => document.getElementById(`block-cover-input-${index}`).click()}
                    >
                      {block.coverPreview ? (
                        <img
                          src={block.coverPreview}
                          alt="Превью обложки блока"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary" textAlign="center">
                          Обложка блока (375x375 px)
                          <br />
                          Перетащите сюда картинку или кликните
                        </Typography>
                      )}
                    </Box>
                    <input
                      id={`block-cover-input-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlockChange(index, 'cover', e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </Box>
                )}
              </Box>
              {block.expanded && (
                <Box sx={{ mt: 2, width: '100%', overflowX: 'hidden' }}>
                  <Droppable
                    droppableId={String(block.id || `block-${index}`)}
                    isDropDisabled={false}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          overflowX: 'hidden',
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Уроки
                        </Typography>
                        <List>
                          {lessons
                            .filter((l) => l.block === (block.id || `block-${index}`))
                            .sort((a, b) => a.order - b.order)
                            .map((lesson, lessonIndex) => (
                              <Draggable
                                key={lesson.id}
                                draggableId={String(lesson.id)}
                                index={lessonIndex}
                              >
                                {(provided) => (
                                  <ListItem
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      border: '1px solid #e0e0e0',
                                      borderRadius: '4px',
                                      mb: 1,
                                      p: 1,
                                      backgroundColor: '#f9f9f9',
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                      '&:hover': { backgroundColor: '#f0f0f0' },
                                      display: 'flex',
                                      alignItems: 'center',
                                      width: '100%',
                                      maxWidth: '100%',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <Checkbox
                                      checked={lesson.is_active}
                                      onChange={(e) =>
                                        handleToggleActive(lesson.id, e.target.checked)
                                      }
                                      sx={{ mr: 1 }}
                                    />
                                    <ListItemText
                                      primary={
                                        <Link
                                          to={`/edit-lesson/${lesson.id}`}
                                          style={{ textDecoration: 'none', color: '#1976d2' }}
                                        >
                                          {lesson.title}
                                        </Link>
                                      }
                                      secondary={lesson.content}
                                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    />
                                  </ListItem>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </List>
                      </Box>
                    )}
                  </Droppable>
                </Box>
              )}
            </Box>
          ))}
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addBlock} sx={{ mb: 2 }}>
            Добавить блок
          </Button>
        </DragDropContext>
      </Box>
    </Box>
  );
};

export default AddCourse;
