from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.contrib.auth import logout as django_logout

# Кастомная вьюха для получения информации о сессии
def session_info(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'meta': {'is_authenticated': True},
            'user': {
                'username': request.user.username,
                'is_staff': request.user.is_staff,
            }
        })
    return JsonResponse({
        'meta': {'is_authenticated': False},
        'user': None
    })

# Кастомная вьюха для выхода
def logout_view(request):
    if request.method == 'POST':
        django_logout(request)  # Завершаем сессию
        return JsonResponse({'status': 'success', 'message': 'Вы вышли из системы'})
    return JsonResponse({'status': 'error', 'message': 'Метод не поддерживается'}, status=405)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
    path('_allauth/', include('allauth.headless.urls')),
    path('api/session/', session_info, name='session_info'),
    path('api/logout/', logout_view, name='logout'),  # Новый эндпоинт для выхода
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
