from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.title_page, name='title_page'),
    path('books/', views.book_list, name='book_list'),
    path('books/update/<int:book_id>/', views.update_book, name='update_book'),
    path('books/transaction/', views.transaction_page, name='transaction_page'),
    path('books/index0/', views.sumple_page, name='sumple_page'),
    path('login/', views.user_login, name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('loading/', views.loading, name='loading')
]
