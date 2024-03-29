from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Book
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
import random
from django.contrib.auth import authenticate, login
from django.contrib import messages

# Create your views here.
def title_page(request):
    books_list = list(Book.objects.all())
    random_books = random.sample(books_list, min(len(books_list), 6))
    return render(request, 'Library_home.html', {'random_books': random_books})

@login_required
def transaction_page(request):
    return render(request, 'Library_transaction.html')


def book_list(request):
    books = Book.objects.all().values()
    return JsonResponse(list(books), safe=False)

@csrf_exempt
def update_book(request, book_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        book = Book.objects.get(id=book_id)
        book.isborrow = data['isborrow']
        if not book.isborrow:
            book.user = ""  # 返却時に貸出者情報をクリア
        else:
            book.user = data.get('user', book.user)  # 貸出時に新しい貸出者情報をセット
        book.save()
        return JsonResponse({'message': 'Book updated successfully!'})


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('transaction_page')
        else:
            messages.error(request, 'ユーザー名またはパスワードが間違っています。')

    return render(request, 'login.html')
