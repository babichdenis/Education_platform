from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Course, Subject, Block, Lesson
from .serializers import CourseSerializer, SubjectSerializer, BlockSerializer, LessonSerializer

class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status='approved')

class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
            return Response(CourseSerializer(course).data)
        except Course.DoesNotExist:
            return Response({'error': 'Курс не найден'}, status=404)

    def put(self, request, pk):
        try:
            course = Course.objects.get(pk=pk, owner=request.user)
            serializer = CourseSerializer(course, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Course.DoesNotExist:
            return Response({'error': 'Курс не найден или вы не автор'}, status=404)

    def patch(self, request, pk):
        try:
            course = Course.objects.get(pk=pk, owner=request.user)
            course.is_active = request.data.get('is_active', course.is_active)
            course.save()
            return Response(CourseSerializer(course).data)
        except Course.DoesNotExist:
            return Response({'error': 'Курс не найден или вы не автор'}, status=404)

    def delete(self, request, pk):
        try:
            course = Course.objects.get(pk=pk, owner=request.user)
            course.delete()
            return Response(status=204)
        except Course.DoesNotExist:
            return Response({'error': 'Курс не найден или вы не автор'}, status=404)

class BlockListCreateView(generics.ListCreateAPIView):
    serializer_class = BlockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Фильтруем блоки по курсу, если указан course_id
        course_id = self.kwargs.get('course_id')
        if course_id:
            return Block.objects.filter(course_id=course_id)
        return Block.objects.all()

    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_id') or self.request.data.get('course')
        course = Course.objects.get(id=course_id, owner=self.request.user)
        serializer.save(course=course)


class BlockDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            block = Block.objects.get(pk=pk)
            serializer = BlockSerializer(block)
            return Response(serializer.data)
        except Block.DoesNotExist:
            return Response({'error': 'Блок не найден'}, status=404)

    def put(self, request, pk):
        try:
            block = Block.objects.get(pk=pk, course__owner=request.user)
            serializer = BlockSerializer(block, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Block.DoesNotExist:
            return Response({'error': 'Блок не найден или вы не автор'}, status=404)

    def patch(self, request, pk):
        try:
            block = Block.objects.get(pk=pk, course__owner=request.user)
            serializer = BlockSerializer(block, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Block.DoesNotExist:
            return Response({'error': 'Блок не найден или вы не автор'}, status=404)

    def delete(self, request, pk):
        try:
            block = Block.objects.get(pk=pk, course__owner=request.user)
            block.delete()
            return Response(status=204)
        except Block.DoesNotExist:
            return Response({'error': 'Блок не найден или вы не автор'}, status=404)


class LessonListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lessons = Lesson.objects.all().order_by('order')
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class LessonDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            lesson = Lesson.objects.get(pk=pk)
            # Проверяем, имеет ли пользователь доступ (например, является владельцем курса или учеником)
            if lesson.course.owner == request.user or request.user in lesson.course.students.all():
                serializer = LessonSerializer(lesson)
                return Response(serializer.data)
            return Response({'error': 'У вас нет доступа к этому уроку'}, status=status.HTTP_403_FORBIDDEN)
        except Lesson.DoesNotExist:
            return Response({'error': 'Урок не найден'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course__owner=request.user)  # Устанавливаем владельца курса
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            lesson = Lesson.objects.get(pk=pk, course__owner=request.user)
            serializer = LessonSerializer(lesson, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Lesson.DoesNotExist:
            return Response({'error': 'Урок не найден'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            lesson = Lesson.objects.get(pk=pk, course__owner=request.user)
            lesson.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Lesson.DoesNotExist:
            return Response({'error': 'Урок не найден'}, status=status.HTTP_404_NOT_FOUND)
