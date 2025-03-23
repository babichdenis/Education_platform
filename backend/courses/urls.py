from django.urls import path
from . import views

urlpatterns = [
    # Предметы
    path('subjects/', views.SubjectListView.as_view(), name='subject-list'),
    
    # Курсы
    path('courses/', views.CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    
    # Блоки (глобальный доступ и вложенный в курс)
    path('blocks/', views.BlockListCreateView.as_view(), name='block-list-create'),
    path('blocks/<int:pk>/', views.BlockDetailView.as_view(), name='block-detail'),
    path('courses/<int:course_id>/blocks/', views.BlockListCreateView.as_view(), name='course-blocks-list'),
    
    # Уроки (глобальный доступ и вложенный в блок)
    path('lessons/', views.LessonListCreateView.as_view(), name='lesson-list-create'),
    path('lessons/<int:pk>/', views.LessonDetailView.as_view(), name='lesson-detail'),
    path('courses/<int:course_id>/blocks/<int:block_id>/lessons/', views.LessonListCreateView.as_view(), name='block-lessons-list'),
]
