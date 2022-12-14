from django.contrib import admin
from .models import *

class SeasonAdmin(admin.ModelAdmin): 
    list_display = ('year','role') 
admin.site.register(Recruitment_season,SeasonAdmin)

class RoundAdmin(admin.ModelAdmin): 
    list_display = ('id', 'season_id', 'type') 
admin.site.register(Rounds,RoundAdmin)

class SectionAdmin(admin.ModelAdmin): 
    list_display = ('id', 'round_id', 'name', 'weightage') 
admin.site.register(Section,SectionAdmin)

class ApplicantAdmin(admin.ModelAdmin): 
    list_display = ('enrollment_no', 'name', 'email', 'mob', 'role', 'cg', 'round_id') 
admin.site.register(Applicant,ApplicantAdmin)

class UsersAdmin(admin.ModelAdmin): 
    list_display = ('enrollment_no', 'name', 'year', 'role')     
admin.site.register(Users,UsersAdmin)

class QuestionAdmin(admin.ModelAdmin): 
    list_display = ('id', 'section_id', 'text', 'mark', 'assignee')     
admin.site.register(Question,QuestionAdmin)

class Interview_panelAdmin(admin.ModelAdmin): 
    list_display = ('id', 'panel_name', 'room_no', 'status', 'season_id') 
admin.site.register(Interview_panel,Interview_panelAdmin)

class Candidate_marksAdmin(admin.ModelAdmin): 
    list_display = ('id', 'applicant_id', 'checked', 'question_id', 'marks', 'remarks') 
admin.site.register(Candidate_marks,Candidate_marksAdmin)

class Candidate_roundAdmin(admin.ModelAdmin): 
    list_display = ('id', 'round_id', 'applicant_id',  'remark', 'status', 'interview_panel', 'time_slot','test') 
admin.site.register(Candidate_round,Candidate_roundAdmin)

class ProjectAdmin(admin.ModelAdmin): 
    list_display = ('project_id', 'project_name', 'marks', 'details','remarks') 
admin.site.register(Project,ProjectAdmin)


