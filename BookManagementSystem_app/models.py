from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255)
    user = models.CharField(max_length=255, blank=True, null=True)
    isborrow = models.BooleanField(default=False)
    num1 = models.IntegerField(default=0)
    num2 = models.IntegerField(default=0)

    def __str__(self):
        return self.title
