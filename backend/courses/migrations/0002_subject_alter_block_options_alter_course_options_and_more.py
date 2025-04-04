# Generated by Django 5.1.7 on 2025-03-21 17:45

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активен')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Название предмета')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
            ],
            options={
                'verbose_name': 'Предмет',
                'verbose_name_plural': 'Предметы',
            },
        ),
        migrations.AlterModelOptions(
            name='block',
            options={'ordering': ['order'], 'verbose_name': 'Блок', 'verbose_name_plural': 'Блоки'},
        ),
        migrations.AlterModelOptions(
            name='course',
            options={'verbose_name': 'Курс', 'verbose_name_plural': 'Курсы'},
        ),
        migrations.AlterModelOptions(
            name='lesson',
            options={'ordering': ['order'], 'verbose_name': 'Урок', 'verbose_name_plural': 'Уроки'},
        ),
        migrations.AlterModelOptions(
            name='test',
            options={'verbose_name': 'Тест', 'verbose_name_plural': 'Тесты'},
        ),
        migrations.RemoveField(
            model_name='test',
            name='answer',
        ),
        migrations.AddField(
            model_name='block',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Дата создания'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='block',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Активен'),
        ),
        migrations.AddField(
            model_name='block',
            name='order',
            field=models.PositiveIntegerField(default=0, verbose_name='Порядок'),
        ),
        migrations.AddField(
            model_name='block',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Дата обновления'),
        ),
        migrations.AddField(
            model_name='course',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Дата создания'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='course',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Активен'),
        ),
        migrations.AddField(
            model_name='course',
            name='status',
            field=models.CharField(choices=[('draft', 'Черновик'), ('pending', 'На модерации'), ('approved', 'Утверждён'), ('rejected', 'Отклонён')], default='draft', max_length=20, verbose_name='Статус'),
        ),
        migrations.AddField(
            model_name='course',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Дата обновления'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='block',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='courses.block', verbose_name='Блок'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Дата создания'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lesson',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Активен'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='order',
            field=models.PositiveIntegerField(default=0, verbose_name='Порядок'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Дата обновления'),
        ),
        migrations.AddField(
            model_name='test',
            name='correct_answer',
            field=models.CharField(default=2, max_length=255, verbose_name='Правильный ответ'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='test',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Дата создания'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='test',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Активен'),
        ),
        migrations.AddField(
            model_name='test',
            name='options',
            field=models.JSONField(blank=True, default=list, verbose_name='Варианты ответа'),
        ),
        migrations.AddField(
            model_name='test',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Дата обновления'),
        ),
        migrations.AlterField(
            model_name='block',
            name='content',
            field=models.TextField(verbose_name='Содержимое'),
        ),
        migrations.AlterField(
            model_name='block',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocks', to='courses.course', verbose_name='Курс'),
        ),
        migrations.AlterField(
            model_name='block',
            name='title',
            field=models.CharField(max_length=200, verbose_name='Название блока'),
        ),
        migrations.AlterField(
            model_name='course',
            name='description',
            field=models.TextField(verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='course',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses', to=settings.AUTH_USER_MODEL, verbose_name='Автор'),
        ),
        migrations.AlterField(
            model_name='course',
            name='title',
            field=models.CharField(max_length=200, verbose_name='Название курса'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='content',
            field=models.TextField(verbose_name='Содержимое'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='courses.course', verbose_name='Курс'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='title',
            field=models.CharField(max_length=255, verbose_name='Название урока'),
        ),
        migrations.AlterField(
            model_name='test',
            name='lesson',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tests', to='courses.lesson', verbose_name='Урок'),
        ),
        migrations.AlterField(
            model_name='test',
            name='question',
            field=models.CharField(max_length=255, verbose_name='Вопрос'),
        ),
        migrations.CreateModel(
            name='CourseModerationLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активен')),
                ('old_status', models.CharField(choices=[('draft', 'Черновик'), ('pending', 'На модерации'), ('approved', 'Утверждён'), ('rejected', 'Отклонён')], max_length=20, verbose_name='Старый статус')),
                ('new_status', models.CharField(choices=[('draft', 'Черновик'), ('pending', 'На модерации'), ('approved', 'Утверждён'), ('rejected', 'Отклонён')], max_length=20, verbose_name='Новый статус')),
                ('comment', models.TextField(blank=True, verbose_name='Комментарий')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderation_logs', to='courses.course', verbose_name='Курс')),
                ('moderator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='moderation_logs', to=settings.AUTH_USER_MODEL, verbose_name='Модератор')),
            ],
            options={
                'verbose_name': 'Лог модерации курса',
                'verbose_name_plural': 'Логи модерации курсов',
            },
        ),
        migrations.AlterField(
            model_name='course',
            name='subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='courses', to='courses.subject', verbose_name='Предмет'),
        ),
        migrations.CreateModel(
            name='UserCourseProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активен')),
                ('progress_percentage', models.FloatField(default=0.0, verbose_name='Процент прохождения')),
                ('completed_lessons', models.ManyToManyField(blank=True, to='courses.lesson', verbose_name='Пройденные уроки')),
                ('completed_tests', models.ManyToManyField(blank=True, to='courses.test', verbose_name='Пройденные тесты')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_progress', to='courses.course', verbose_name='Курс')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='course_progress', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Прогресс пользователя по курсу',
                'verbose_name_plural': 'Прогресс пользователей по курсам',
                'unique_together': {('user', 'course')},
            },
        ),
    ]
