from django.db import models
from django.contrib.auth.models import User

class Movie(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    thumbnail = models.FileField(upload_to='uploads/thumb/')
    video_url = models.FileField(upload_to='uploads/video/') 
    view_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'movie')
        

class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    date_viewed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} viewed {self.movie.name} on {self.date_viewed}"