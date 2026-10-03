from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Try finding user and checking password directly for custom models if authenticate fails
        user = authenticate(request, username=username, password=password)
        if user is None:
            try:
                user_obj = User.objects.get(username=username)
                if user_obj.check_password(password):
                    user = user_obj
            except User.DoesNotExist:
                pass

        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful', 'user': UserSerializer(user).data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)

            # Ensure the refresh token belongs to the logged-in user.
            if str(token.get("user_id")) != str(request.user.pk):
                return Response(
                    {"error": "Invalid refresh token."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Revoke the refresh token.
            token.blacklist()

        except TokenError:
            return Response(
                {"error": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Also clear the Django session, if one exists.
        logout(request)

        return Response(
            {"message": "Logout successful."},
            status=status.HTTP_200_OK,
        )

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
