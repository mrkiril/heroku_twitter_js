"""firstapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.conf.urls import include
from . import views
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    url(r'^del/\d+', views.delete_twit),
    url(r'^add/', views.add_twit),
    url(r'^upd/', views.update_twit),
    url(r'^get/\d+', views.get_twit),


    #url(r'^update/form/\d+', views.update_form),    
    #url(r'^update/db/', views.update_db),    
    
    # reg form life update
    #url(r'^user_life', views.reguser_life),    
    #url(r'^pass_life', views.regpass_life),    

]