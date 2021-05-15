from django.conf.urls import url

from . import views

app_name = 'diplom_backend'



urlpatterns = [
    # url(r'^$', views.index, name='index'),
    # url(r'^home$', views.hello),
    # url('', views.hello),
    url('hello/', views.hello),
    url('report/', views.report),
    url('recognize/', views.recognize),

    #url('test/', views.test)
]

