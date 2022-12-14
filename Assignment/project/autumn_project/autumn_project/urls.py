"""autumn_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from recruitments import views
from django.contrib import admin


router = DefaultRouter()

router.register('recruitment_season', views.RecruitmentSeasonViewSet, basename='season')
router.register('rounds', views.RoundsViewSet, basename='rounds')
router.register('section', views.SectionViewSet ,basename='section')
router.register('question', views.QuestionViewSet ,basename='question')
router.register('Users', views.UsersViewSet ,basename='member')
router.register('applicant', views.ApplicantViewSet ,basename='applicant')
router.register('interview_panel', views.InterviewPanelViewSet ,basename='interview_panel')
router.register('candidate_round', views.CandidateRoundViewSet ,basename='candidate_round')
router.register('candidate_marks', views.CandidateMarksViewSet ,basename='candidate_marks')
router.register('login',views.UsersLoginViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # path('api/', include(router.urls))
    # path('auth/login/', views.LoginView.as_view()),
    # path('auth/logout/', views.LogoutView.as_view())
]

#todo: create routers
