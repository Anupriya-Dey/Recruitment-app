from rest_framework import viewsets
from rest_framework import permissions
from .models import Applicant, Candidate_marks, Candidate_round, IMG_member, Interview_panel, Question, Recruitment_season, Rounds, Section
from .serializers import ApplicantSerializer, CandidateMarksSerializer, CandidateRoundSerializer, IMGMemberSerializer, InterviewPanelSerializer, QuestionSerializer, RecruitmentSeasonSerializer, RoundsSerializer, SectionSerializer


class RecruitmentSeasonViewSet(viewsets.ModelViewSet):
    queryset=Recruitment_season.objects.all()
    serializer_class=RecruitmentSeasonSerializer
    permission_classes = [permissions.IsAuthenticated]
    

class RoundsViewSet(viewsets.ModelViewSet):
    queryset=Rounds.objects.all()
    serializer_class=RoundsSerializer
    # permission_classes = [permissions.IsAuthenticated]
    

class SectionViewSet(viewsets.ModelViewSet):
    queryset=Section.objects.all()
    serializer_class=SectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    

class QuestionViewSet(viewsets.ModelViewSet):
    queryset=Question.objects.all()
    serializer_class=QuestionSerializer
    

class ApplicantViewSet(viewsets.ModelViewSet):
    queryset=Applicant.objects.all()
    serializer_class=ApplicantSerializer
    

class IMGMemberViewSet(viewsets.ModelViewSet):
    queryset=IMG_member.objects.all()
    serializer_class=IMGMemberSerializer
    

class InterviewPanelViewSet(viewsets.ModelViewSet):
    queryset=Interview_panel.objects.all()
    serializer_class=InterviewPanelSerializer
    
class CandidateMarksViewSet(viewsets.ModelViewSet):
    queryset=Candidate_marks.objects.all()
    serializer_class=CandidateMarksSerializer
    

class CandidateRoundViewSet(viewsets.ModelViewSet):
    queryset=Candidate_round.objects.all()
    serializer_class=CandidateRoundSerializer
    
# Create your views here.
