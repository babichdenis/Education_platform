from rest_framework import serializers
from .models import Subject, Course, Block, Lesson

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'is_active', 'title', 'content', 'full_content', 'order', 'block', 'course']

class BlockSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Block
        fields = ['id', 'is_active', 'title', 'content', 'full_content', 'order', 'course', 'cover', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True, read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())

    class Meta:
        model = Course
        fields = ['id', 'is_active', 'title', 'subject', 'description', 'full_content', 'owner', 'status', 'cover', 'blocks', 'lessons']
        read_only_fields = ['owner']
