from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255)
    genre = models.ForeignKey('Genre', on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, null=True)
    isborrow = models.BooleanField(default=False)
    num1 = models.IntegerField(default=0)
    num2 = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Genre(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name
#ぞの
