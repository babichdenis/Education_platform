from django.db import models
from django.conf import settings


class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class BaseModel(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name='Дата обновления')
    is_active = models.BooleanField(default=True, verbose_name='Активен')

    objects = ActiveManager()  # Менеджер для активных записей
    all_objects = models.Manager()  # Менеджер для всех записей, включая неактивные

    class Meta:
        abstract = True  # Абстрактная модель

    def __str__(self):
        return f"{self.__class__.__name__} (ID: {self.id})"

    def soft_delete(self):
        self.is_active = False
        self.save()

    def restore(self):
        self.is_active = True
        self.save()



# Статусы курса для модерации
COURSE_STATUS_CHOICES = (
    ('draft', 'Черновик'),
    ('pending', 'На модерации'),
    ('approved', 'Утверждён'),
    ('rejected', 'Отклонён'),
)


class Subject(BaseModel):
    name = models.CharField(max_length=100, unique=True,
                            verbose_name='Название предмета')
    description = models.TextField(blank=True, verbose_name='Описание')

    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'

    def __str__(self):
        return self.name


class Course(BaseModel):
    title = models.CharField(max_length=200, verbose_name='Название курса')
    subject = models.ForeignKey(
        Subject,
        on_delete=models.PROTECT,
        related_name='courses',
        verbose_name='Предмет'
    )
    description = models.TextField(verbose_name='Краткое описание')
    full_content = models.TextField(verbose_name='Полное содержание', blank=True, default='')  # Новое поле для HTML
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='courses',
        on_delete=models.CASCADE,
        verbose_name='Автор'
    )
    status = models.CharField(
        max_length=20,
        choices=COURSE_STATUS_CHOICES,
        default='draft',
        verbose_name='Статус'
    )
    cover = models.ImageField(
        upload_to='course_covers/',
        null=True,
        blank=True,
        verbose_name='Обложка курса'
    )

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'

    def __str__(self):
        return self.title

    def is_approved(self):
        return self.status == 'approved'

class Block(BaseModel):
    course = models.ForeignKey(
        Course,
        related_name='blocks',
        on_delete=models.CASCADE,
        verbose_name='Курс'
    )
    title = models.CharField(max_length=200, verbose_name='Название блока')
    content = models.TextField(verbose_name='Краткое содержание')
    full_content = models.TextField(verbose_name='Полное содержание', blank=True, default='')  # Новое поле для HTML
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')
    cover = models.ImageField(
        upload_to='block_covers/',
        null=True,
        blank=True,
        verbose_name='Обложка блока'
    )

    objects = models.Manager()

    class Meta:
        verbose_name = 'Блок'
        verbose_name_plural = 'Блоки'
        ordering = ['order']

    def __str__(self):
        return self.title

class Lesson(BaseModel):
    course = models.ForeignKey(
        Course,
        related_name='lessons',
        on_delete=models.CASCADE,
        verbose_name='Курс'
    )
    block = models.ForeignKey(
        Block,
        related_name='lessons',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='Блок'
    )
    title = models.CharField(max_length=255, verbose_name='Название урока')
    content = models.TextField(verbose_name='Краткое содержание', blank=True)
    full_content = models.TextField(verbose_name='Полное содержание', blank=True, default='')  # Новое поле для HTML
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')

    objects = models.Manager()

    class Meta:
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'
        ordering = ['order']

    def __str__(self):
        return self.title

class Test(BaseModel):
    lesson = models.ForeignKey(
        Lesson,
        related_name='tests',
        on_delete=models.CASCADE,
        verbose_name='Урок'
    )
    question = models.CharField(max_length=255, verbose_name='Вопрос')
    correct_answer = models.CharField(max_length=255, verbose_name='Правильный ответ')
    options = models.JSONField(default=list, blank=True, verbose_name='Варианты ответа')

    class Meta:
        verbose_name = 'Тест'
        verbose_name_plural = 'Тесты'

    def __str__(self):
        return self.question

class CourseModerationLog(BaseModel):
    course = models.ForeignKey(
        Course,
        related_name='moderation_logs',
        on_delete=models.CASCADE,
        verbose_name='Курс'
    )
    moderator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='moderation_logs',
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Модератор'
    )
    old_status = models.CharField(
        max_length=20,
        choices=COURSE_STATUS_CHOICES,
        verbose_name='Старый статус'
    )
    new_status = models.CharField(
        max_length=20,
        choices=COURSE_STATUS_CHOICES,
        verbose_name='Новый статус'
    )
    comment = models.TextField(blank=True, verbose_name='Комментарий')
    changed_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата изменения')  # Добавляем явно

    class Meta:
        verbose_name = 'Лог модерации курса'
        verbose_name_plural = 'Логи модерации курсов'

    def __str__(self):
        return f"{self.course.title}: {self.old_status} -> {self.new_status}"


class UserCourseProgress(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='course_progress',
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )
    course = models.ForeignKey(
        Course,
        related_name='user_progress',
        on_delete=models.CASCADE,
        verbose_name='Курс'
    )
    completed_lessons = models.ManyToManyField(
        Lesson,
        blank=True,
        verbose_name='Пройденные уроки'
    )
    completed_tests = models.ManyToManyField(
        Test,
        blank=True,
        verbose_name='Пройденные тесты'
    )
    progress_percentage = models.FloatField(
        default=0.0,
        verbose_name='Процент прохождения'
    )

    class Meta:
        verbose_name = 'Прогресс пользователя по курсу'
        verbose_name_plural = 'Прогресс пользователей по курсам'
        # Один прогресс на пользователя и курс
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"

    def update_progress(self):
        total_lessons = self.course.lessons.count()
        total_tests = self.course.lessons.aggregate(
            models.Count('tests'))['tests__count'] or 0
        completed_lessons_count = self.completed_lessons.count()
        completed_tests_count = self.completed_tests.count()

        total_items = total_lessons + total_tests
        completed_items = completed_lessons_count + completed_tests_count

        if total_items > 0:
            self.progress_percentage = (completed_items / total_items) * 100
        else:
            self.progress_percentage = 0.0
        self.save()
