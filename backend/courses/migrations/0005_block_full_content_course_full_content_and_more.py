# Generated by Django 5.1.7 on 2025-03-22 03:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_block_cover_course_cover'),
    ]

    operations = [
        migrations.AddField(
            model_name='block',
            name='full_content',
            field=models.TextField(blank=True, default='', verbose_name='Полное содержание'),
        ),
        migrations.AddField(
            model_name='course',
            name='full_content',
            field=models.TextField(blank=True, default='', verbose_name='Полное содержание'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='full_content',
            field=models.TextField(blank=True, default='', verbose_name='Полное содержание'),
        ),
        migrations.AlterField(
            model_name='block',
            name='content',
            field=models.TextField(verbose_name='Краткое содержание'),
        ),
        migrations.AlterField(
            model_name='course',
            name='description',
            field=models.TextField(verbose_name='Краткое описание'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='content',
            field=models.TextField(verbose_name='Краткое содержание'),
        ),
    ]
