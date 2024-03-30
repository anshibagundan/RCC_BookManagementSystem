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

def sumple_page(request):
    return render(request, 'index0.html')


def book_list(request):
    books = Book.objects.all().values()
    return JsonResponse(list(books), safe=False)

@csrf_exempt
def update_book(request, book_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)  # リクエストのJSONデータをロード
            book = Book.objects.get(pk=book_id)  # 対象の書籍を取得

            # ここで書籍のデータを更新
            book.isborrow = data.get('isborrow', book.isborrow)
            book.user_id = data.get('user', book.user_id)
            book.save()  # 変更を保存

            # 更新成功のレスポンスを返す
            return JsonResponse({'message': 'Book updated successfully.'})
        except Book.DoesNotExist:
            # 書籍が見つからない場合のエラーレスポンス
            return HttpResponseNotFound({'message': 'Book not found.'})
        except (ValueError, KeyError):
            # 不正なデータが送信された場合のエラーレスポンス
            return HttpResponseBadRequest({'message': 'Invalid data.'})
    else:
        # PUTリクエスト以外でアクセスされた場合のレスポンス
        return HttpResponseBadRequest({'message': 'Invalid request method.'})


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
