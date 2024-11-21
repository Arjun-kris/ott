from datetime import date
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login
from django.http import Http404, JsonResponse
from django.utils import timezone
from serveradmin.models import Movie
from .forms import CustomLoginForm
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from .serializers import MovieSerializer, SignupSerializer, WatchHistorySerializer
from django.core.files.storage import FileSystemStorage
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import Movie, Wishlist, History
from django.contrib.auth.decorators import user_passes_test
import os
from django.conf import settings


#API
#-------

#profile
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save(password=make_password(
            serializer.validated_data['password']))
        token, _ = Token.objects.get_or_create(user=user)
        if token:
            auth_login(request, user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('username')
    password = request.data.get('password')
    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(request, username=email, password=password)
    if user is not None:
        auth_login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "first_name": user.first_name}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    token = request.auth
    if token:
        token.delete()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    return Response({"error": "Authentication token required"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    if new_password != confirm_password:
        return Response({"error": "New passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
    if not request.user.check_password(current_password):
        return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
    request.user.set_password(new_password)
    request.user.save()
    return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)


#Movies
@api_view(['GET'])
def movie_list(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def movie_detail(request, id):
    try:
        movie = Movie.objects.get(id=id)
        thumbnail_url = request.build_absolute_uri(movie.thumbnail.url) if movie.thumbnail else None
        video_url_url = request.build_absolute_uri(movie.video_url.url) if movie.video_url else None
        movie_data = {
            'id': movie.id,
            'name': movie.name,
            'description': movie.description,
            'thumbnail': thumbnail_url,
            'video_url_url': video_url_url,
            'view_count': movie.view_count,
        }
        return JsonResponse(movie_data)
    
    except Movie.DoesNotExist:
        return JsonResponse({'error': 'Movie not found'}, status=404)
    except Exception as e:
        print("Unexpected error:", e)
        return JsonResponse({'error': 'Internal server error'}, status=500)
    

#Watchlist
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def watchlist(request):
    watchlist_item = Wishlist.objects.filter(user=request.user)
    movies = [
        {
            "id": item.movie.id,
            "name": item.movie.name,
            "description": item.movie.description,
            "thumbnail": request.build_absolute_uri(item.movie.thumbnail.url) if item.movie.thumbnail else None
        }
        for item in watchlist_item
    ]
    return Response(movies, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request, movie_id):
    user = request.user
    try:
        movie = Movie.objects.get(id=movie_id)
        created = Wishlist.objects.get_or_create(
            user=user, movie=movie)
        if created:
            return JsonResponse({'message': 'Movie added to wishlist'}, status=201)
        else:
            return JsonResponse({'message': 'Movie already in wishlist'}, status=200)
    except Movie.DoesNotExist:
        return JsonResponse({'error': 'Movie not found'}, status=404)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
        watchlist_item = Wishlist.objects.get(
            user=request.user, movie=movie)
        watchlist_item.delete()
        return Response({"message": "Movie removed from watchlist"}, status=status.HTTP_204_NO_CONTENT)
    except Wishlist.DoesNotExist:
        return Response({"error": "Movie not found in watchlist"}, status=status.HTTP_404_NOT_FOUND)


#View count  
@api_view(['PATCH'])
def increment_view_count(request, id):
    if request.method == 'PATCH':
        movie = get_object_or_404(Movie, id=id)
        movie.view_count += 1
        movie.save()
        return JsonResponse({'success': True, 'view_count': movie.view_count})
    return JsonResponse({'success': False}, status=400)


#Watch History
@api_view(['POST'])
@permission_classes([IsAuthenticated])    
def add_watch_history(request, movie_id):
    if request.method == 'POST':
        user = request.user
        today = date.today()
        history_entry = History.objects.filter(user=user, movie_id=movie_id, date_viewed__date=today).first()
        if not history_entry:
            History.objects.create(user=user, movie_id=movie_id, date_viewed=timezone.now())
            return JsonResponse({'message': 'History added successfully'}, status=201)
        else:
            return JsonResponse({'message': 'Already viewed today'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watch_history(request):
    history = History.objects.filter(user=request.user).order_by('-date_viewed')
    serializer = WatchHistorySerializer(history, many=True)
    return Response(serializer.data, status=200)

def toggle_user_status(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        is_active = request.POST.get("is_active") == "true"
        try:
            user = User.objects.get(id=user_id)
            user.is_active = is_active
            user.save()
            return JsonResponse({"message": "User status updated successfully."}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)
    return JsonResponse({"error": "Invalid request."}, status=400)

    
#Admin
#------

def is_admin(user):
    return user.is_superuser

#Profile
def loginpage(request):
    return render(request, 'index.html')

@user_passes_test(is_admin, login_url='/error/')
def changepasswordpage(request):
    return render(request, 'changepassword.html')

def error(request):
    return render(request, 'error.html')

def user_list(request):
    query = request.GET.get('query', '')
    if query:
        users = User.objects.filter(Q(username__icontains=query))
    else:
        users = User.objects.all()
    return render(request, 'user.html', {'users': users})

#Movies
@user_passes_test(is_admin, login_url='/error/')
def movies(request):
    movies_list = Movie.objects.all()
    return render(request, 'movies.html', {'movies': movies_list})

@user_passes_test(is_admin, login_url='/error/')
def viewmoviepage(request, movie_id):
    movie = Movie.objects.get(id=movie_id)
    return render(request, 'viewmovie.html', {'movie': movie, 'movie_id': movie_id})

@user_passes_test(is_admin, login_url='/error/')
def editmoviepage(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    if request.method == 'POST':
        movie.name = request.POST.get('name')
        movie.description = request.POST.get('description')
        if 'video_url' in request.FILES: 
            movie.video_url= request.FILES['video_url'] 
        if 'thumbnail' in request.FILES:
            movie.thumbnail = request.FILES['thumbnail']  
        movie.save()
        return redirect('movies')
    return render(request, 'editmovie.html', {'movie': movie, 'movie_id': movie_id})


def delete_movie(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    movie.delete()
    return redirect('movies')  

@user_passes_test(is_admin, login_url='/error/')
def addmovie(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        video_url = request.FILES['video_url'] 
        thumbnail = request.FILES['thumbnail'] 
        Movie.objects.create(
            name=name,
            description=description,
            video_url=video_url,
            thumbnail=thumbnail,
        )
        return redirect('movies')
    return render(request, 'addmovie.html')


#Userdata 
@user_passes_test(is_admin, login_url='/error/')   
def user(request):
    users = User.objects.all()
    return render(request, 'user.html', {'users': users})

@user_passes_test(is_admin, login_url='/error/')
def watchhistory(request, user_id):
    user = get_object_or_404(User, id=user_id)
    history_records = History.objects.filter(user=user).order_by('-date_viewed')
    return render(request, 'watchhistory.html', {'user': user, 'history_records': history_records})


#Report
@user_passes_test(is_admin, login_url='/error/')
def report(request):
    movies_list = Movie.objects.all().order_by('-view_count')
    return render(request, 'report.html', {'movies': movies_list})
