from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Movie, History

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name']

    def create(self, validated_data):
        user = User(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name'),
            password=(validated_data['password']),
        )
        user.save()
        return user


class MovieSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id', 'name', 'description', 'thumbnail_url', 'video_url', 'view_count']

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.thumbnail.url) if obj.thumbnail and request else None

    def get_video_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.video_url.url) if obj.video_url and request else None   

        
class WatchHistorySerializer(serializers.ModelSerializer):
    movie_name = serializers.CharField(source='movie.name', read_only=True)
    class Meta:
        model = History
        fields = ['movie_name', 'date_viewed']