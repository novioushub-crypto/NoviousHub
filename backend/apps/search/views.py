from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from apps.products.models import Product
from apps.products.serializers import ProductListSerializer


@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '')
    
    if not query:
        return Response({'results': []})
    
    search_vector = SearchVector('name', weight='A') + SearchVector('description', weight='B')
    search_query = SearchQuery(query)
    
    products = Product.objects.annotate(
        rank=SearchRank(search_vector, search_query)
    ).filter(rank__gte=0.01, is_active=True).order_by('-rank')[:20]
    
    serializer = ProductListSerializer(products, many=True)
    return Response({'results': serializer.data})
