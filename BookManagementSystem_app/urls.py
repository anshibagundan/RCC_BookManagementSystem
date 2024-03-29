from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
    path('', views.title_page, name='title_page'),
    path('books/', views.book_list, name='book_list'),
    path('books/update/<int:book_id>/', views.update_book, name='update_book'),
    path('books/transaction/', views.transaction_page, name='transaction_page'),  
]
