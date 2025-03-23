from django.contrib import admin
from .models import Subject, Course, Block, Lesson, Test, CourseModerationLog, UserCourseProgress

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    list_editable = ('is_active',)
    actions = ['soft_delete', 'restore']

    def soft_delete(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Выбранные предметы помечены как неактивные.")
    soft_delete.short_description = "Мягкое удаление выбранных предметов"

    def restore(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Выбранные предметы восстановлены.")
    restore.short_description = "Восстановить выбранные предметы"

    def get_queryset(self, request):
        return Subject.all_objects.all()

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'owner', 'status', 'is_active', 'created_at', 'updated_at')
    list_filter = ('status', 'is_active', 'subject')
    search_fields = ('title', 'description', 'owner__username')
    list_editable = ('status', 'is_active')
    actions = ['soft_delete', 'restore']
    raw_id_fields = ('owner', 'subject')
    list_per_page = 20

    def soft_delete(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Выбранные курсы помечены как неактивные.")
    soft_delete.short_description = "Мягкое удаление выбранных курсов"

    def restore(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Выбранные курсы восстановлены.")
    restore.short_description = "Восстановить выбранные курсы"

    def get_queryset(self, request):
        return Course.all_objects.all()

@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'course')
    search_fields = ('title', 'content')
    list_editable = ('order', 'is_active')
    actions = ['soft_delete', 'restore']
    raw_id_fields = ('course',)

    def soft_delete(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Выбранные блоки помечены как неактивные.")
    soft_delete.short_description = "Мягкое удаление выбранных блоков"

    def restore(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Выбранные блоки восстановлены.")
    restore.short_description = "Восстановить выбранные блоки"

    def get_queryset(self, request):
        return Block.all_objects.all()

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'block', 'order', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'course', 'block')
    search_fields = ('title', 'content')
    list_editable = ('order', 'is_active')
    actions = ['soft_delete', 'restore']
    raw_id_fields = ('course', 'block')

    def soft_delete(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Выбранные уроки помечены как неактивные.")
    soft_delete.short_description = "Мягкое удаление выбранных уроков"

    def restore(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Выбранные уроки восстановлены.")
    restore.short_description = "Восстановить выбранные уроки"

    def get_queryset(self, request):
        return Lesson.all_objects.all()

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('question', 'lesson', 'correct_answer', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'lesson__course')
    search_fields = ('question', 'correct_answer')
    list_editable = ('is_active',)
    actions = ['soft_delete', 'restore']
    raw_id_fields = ('lesson',)

    def soft_delete(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Выбранные тесты помечены как неактивные.")
    soft_delete.short_description = "Мягкое удаление выбранных тестов"

    def restore(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Выбранные тесты восстановлены.")
    restore.short_description = "Восстановить выбранные тесты"

    def get_queryset(self, request):
        return Test.all_objects.all()

@admin.register(CourseModerationLog)
class CourseModerationLogAdmin(admin.ModelAdmin):
    list_display = ('course', 'moderator', 'old_status', 'new_status', 'changed_at')
    list_filter = ('old_status', 'new_status')
    search_fields = ('course__title', 'moderator__username', 'comment')
    raw_id_fields = ('course', 'moderator')
    readonly_fields = ('changed_at',)

    def get_queryset(self, request):
        return CourseModerationLog.all_objects.all()

@admin.register(UserCourseProgress)
class UserCourseProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress_percentage', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'course')
    search_fields = ('user__username', 'course__title')
    list_editable = ('is_active',)
    actions = ['soft_delete', 'restore']
    raw_id_fields = ('user', 'course')

    def soft_delete(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Выбранные записи прогресса помечены как неактивные.")
    soft_delete.short_description = "Мягкое удаление выбранных записей прогресса"

    def restore(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Выбранные записи прогресса восстановлены.")
    restore.short_description = "Восстановить выбранные записи прогресса"

    def get_queryset(self, request):
        return UserCourseProgress.all_objects.all()
