from django.shortcuts import render

# Create your views here.
def title_page(request):
    return render(request, 'BookManagementSystem_app/title.html')
