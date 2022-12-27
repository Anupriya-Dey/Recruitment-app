
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

router.register('project', views.ProjectViewSet ,basename='project')


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns=[ path('',include(router.urls)),
path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
path('api/', include(router.urls))]



