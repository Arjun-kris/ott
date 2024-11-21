from django import forms
from django.contrib.auth.forms import AuthenticationForm

class CustomLoginForm(AuthenticationForm):
    username = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control bg-light mb-3', 'placeholder': 'Enter Email'})
    )

    password = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={'class': 'form-control bg-light mb-3', 'placeholder': 'Enter Password'})
    )