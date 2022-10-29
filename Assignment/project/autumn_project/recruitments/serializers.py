from rest_framework import serializers
from .models import Applicant, IMG_member, Interview_panel, Candidate_marks, Question, Recruitment_season, Candidate_round, Rounds, Section

class RecruitmentSeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruitment_season
        fields = "__all__"
class RecruitmentSeasonNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruitment_season
        fields = ['year','role']        

class RoundsSerializer(serializers.ModelSerializer):
    season_id = RecruitmentSeasonNameSerializer()
    class Meta:
        model = Rounds
        fields = ['id', 'season_id', 'type']

class SectionSerializer(serializers.ModelSerializer):
    round_id = RoundsSerializer()
    class Meta:
        model = Section
        fields = "__all__"
        
class SectionNameSerializer(serializers.ModelSerializer):
    round_id = RoundsSerializer()
    class Meta:
        model = Section
        fields = ['id', 'round_id', 'name', 'weightage']

class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = "__all__"

class IMGMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = IMG_member
        fields = "__all__"  

class IMGMemberNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = IMG_member
        fields = ['enrollment_no', 'name', 'year']      

class QuestionSerializer(serializers.ModelSerializer):
    assignee = IMGMemberNameSerializer()
    section_id = SectionNameSerializer()
    class Meta:
        model = Question
        fields = ['id', 'section_id', 'text', 'mark', 'assignee']

class InterviewPanelSerializer(serializers.ModelSerializer):
    season_id = RecruitmentSeasonNameSerializer()
    panelist = IMGMemberNameSerializer(many=True)
    class Meta:        
        model = Interview_panel
        fields = ['id', 'panel_name', 'panelist', 'room_no', 'status', 'season_id']

class CandidateMarksSerializer(serializers.ModelSerializer):
    # round_id = RoundsSerializer()
    applicant_id = ApplicantSerializer()
    question_id = QuestionSerializer()
    class Meta:
        model = Candidate_marks
        fields = ['id', 'applicant_id', 'checked', 'question_id', 'marks', 'remarks']
        
class CandidateRoundSerializer(serializers.ModelSerializer):
    round_id = RoundsSerializer()
    applicant_id = ApplicantSerializer()
    class Meta:
        model = Candidate_round
        fields = ['id', 'round_id', 'applicant_id', 'remark', 'status', 'interview_panel', 'time_slot']
        

        
        
        
