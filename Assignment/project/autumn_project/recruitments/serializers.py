from rest_framework import serializers
from .models import Applicant, Project, Users, Interview_panel, Candidate_marks, Question, Recruitment_season, Candidate_round, Rounds, Section

class RecruitmentSeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruitment_season
        fields = "__all__"
     

class RoundsSerializer(serializers.ModelSerializer):
    season_id = RecruitmentSeasonSerializer(read_only=True)
    class Meta:
        model = Rounds
        fields = "__all__"

class SectionSerializer(serializers.ModelSerializer):
    round_id = RoundsSerializer(read_only=True)
    class Meta:
        model = Section
        fields = "__all__"
        
class SectionNameSerializer(serializers.ModelSerializer):
    round_id = RoundsSerializer(read_only=True)
    class Meta:
        model = Section
        fields = "__all__"

class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = "__all__"

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"  

class UsersNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"    

class QuestionSerializer(serializers.ModelSerializer):
    assignee = UsersNameSerializer(read_only=True)
    section_id = SectionNameSerializer(read_only=True)
    class Meta:
        model = Question
        fields = "__all__" 

class InterviewPanelSerializer(serializers.ModelSerializer):
    season_id = RecruitmentSeasonSerializer()
    panelist = UsersNameSerializer(many=True)
    class Meta:        
        model = Interview_panel
        fields = "__all__" 

class CandidateMarksSerializer(serializers.ModelSerializer):
    # round_id = RoundsSerializer()
    applicant_id = ApplicantSerializer()
    question_id = QuestionSerializer()
    class Meta:
        model = Candidate_marks
        fields = "__all__" 

class CandidateRoundSerializer(serializers.ModelSerializer):
    round_id = RoundsSerializer()
    applicant_id = ApplicantSerializer()
    class Meta:
        model = Candidate_round
        fields = "__all__" 
        
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Project
        fields='__all__'
        
        
        
