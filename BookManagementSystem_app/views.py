from django.shortcuts import render
from django.http import JsonResponse
from .models import Book
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here.
def title_page(request):
    return render(request, 'index.html')

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

