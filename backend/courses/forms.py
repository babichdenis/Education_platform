from django import forms
from .models import Course, Block

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['title', 'subject', 'description']

class BlockForm(forms.ModelForm):
    class Meta:
        model = Block
        fields = ['title', 'content']
