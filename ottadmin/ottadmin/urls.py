"""
URL configuration for ottadmin project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from serveradmin import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    #UI
    path('', views.loginpage, name='login'),
    path('error/', views.error, name='error'),
    path('user/', views.user, name='user'),
    path('changepasswordpage/', views.changepasswordpage, name='changepasswordpage'),
    path('toggle_user_status/', views.toggle_user_status, name='toggle_user_status'),
    path('movies/', views.movies, name='movies'),
    path('addmovie/', views.addmovie, name='addmovie'),
    path('editmovie/<int:movie_id>/', views.editmoviepage, name='editmovie'),
    path('viewmovie/<int:movie_id>/', views.viewmoviepage, name='viewmovie'),
    path('delete_movie/<int:movie_id>/', views.delete_movie, name='delete_movie'),
    path('watchhistory/<int:user_id>/', views.watchhistory, name='watchhistory'),
    path('report/', views.report, name='report'),
    
    #API
    path('change_password/', views.change_password, name='change_password'),
    path('signup/', views.signup, name='api-signup'),
    path('login/', views.login, name='api-login'),
    path('logout/', views.logout, name='api-logout'),
    path('movie_list/', views.movie_list, name='movie_list'),
    path('movie_detail/<int:id>/', views.movie_detail, name='movie_detail'),
    path('increment_view_count/<int:id>/', views.increment_view_count, name='increment_view_count'),
    path('add_to_wishlist/<int:movie_id>/', views.add_to_wishlist, name='add_to_wishlist'),
    path('watchlist/', views.watchlist, name='watchlist'),
    path('remove_from_watchlist/<int:movie_id>/', views.remove_from_watchlist, name='remove_from_watchlist'),
    path('add_watch_history/<int:movie_id>/', views.add_watch_history, name='add_watch_history'),
    path('get_watch_history/', views.get_watch_history, name='get_watch_history'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

