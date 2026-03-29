from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for monitoring"""
    response_data = {
        'status': 'healthy',
        'message': 'Noviious API is running'
    }
    
    # Try database connection but don't fail if it's not available
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        response_data['database'] = 'connected'
    except Exception as e:
        response_data['database'] = 'disconnected'
        response_data['db_error'] = str(e)
    
    return Response(response_data)
