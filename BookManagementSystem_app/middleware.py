from django.http import HttpResponseForbidden

class RestrictIPAddressMiddleware:
    # 許可されたIPアドレスのリスト
    allowed_ips = ['127.0.0.1', '172.20.10.6']  # ここに許可したいIPアドレスを追加

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == '':  # 制限したいエンドポイント
            ip = request.META.get('REMOTE_ADDR')  # リクエスト元のIPアドレスを取得
            if ip not in self.allowed_ips:
                return HttpResponseForbidden()  # 許可されていないIPアドレスからのアクセスは禁止

        response = self.get_response(request)
        return response
