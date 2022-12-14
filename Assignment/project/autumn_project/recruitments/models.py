
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
DEVELOPER = 'dev'
DESIGNER = 'des'
ROLE_CHOICES = [
    (DESIGNER, 'Designer'),
    (DEVELOPER, 'Developer'),        
]

class Recruitment_season(models.Model):   
    year = models.IntegerField(primary_key=True)
    name = models.TextField()
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, default=DEVELOPER)
    start = models.DateTimeField(auto_now_add=True)
    end = models.DateTimeField()

    def __str__(self):
        return str(self.year)

class Rounds(models.Model):  
    WRITTEN = 'w'
    INTERVIEW = 'i'
    PROJECT = 'p'
    
    ROUND_CHOICES = [
        (WRITTEN, 'Written Test'),
        (INTERVIEW, 'Interview'),
        (PROJECT, 'Project'),
        
    ] 
    id = models.IntegerField(primary_key=True)
    season_id = models.ForeignKey(Recruitment_season, on_delete = models.CASCADE, related_name='season_year')
    type = models.CharField(max_length=1, choices=ROUND_CHOICES, default=WRITTEN)

    def __str__(self):
        return str(self.id)
        # return str(self.season_id)

class Section(models.Model):   
    round_id = models.ForeignKey(Rounds, on_delete=models.CASCADE, related_name='section_id')
    name = models.TextField()
    weightage = models.FloatField()
    def __str__(self):
        return str(self.round_id)

class Applicant(models.Model):   
    enrollment_no = models.IntegerField(primary_key=True) 
    name = models.TextField()
    email = models.EmailField()
    mob = models.PositiveIntegerField()
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, default=DEVELOPER)
    cg = models.FloatField()
    round_id = models.ForeignKey(Rounds, on_delete=models.CASCADE, related_name='applicant_id')

    def __str__(self):
        return str(self.enrollment_no)
    # called = models.BooleanField(default=False)
   
class Users(AbstractUser):   
    enrollment_no = models.IntegerField(primary_key=True) 
    name = models.TextField()
    email = models.TextField()
    mob = models.PositiveIntegerField()
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, default=DEVELOPER)
    year = models.IntegerField()

    def __str__(self):
        return str(self.enrollment_no)

class Question(models.Model):   
    id = models.IntegerField(primary_key=True)
    section_id = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='question_id')
    text = models.TextField()
    mark = models.FloatField()
    assignee = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='assignee_enrollment_no')
    
class Interview_panel(models.Model): 
    INACTIVE = 'in'
    OCCUPIED = 'oc'
    IDLE = 'id'
    STATUS_CHOICES = [
        (INACTIVE, 'Inactive'),
        (OCCUPIED, 'Occupied'),
        (IDLE, 'Idle'),
    ]  
    panel_name = models.TextField()
    panelist = models.ManyToManyField(Users, related_name='panelist_enrollment_no')
    room_no = models.IntegerField()
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=INACTIVE)
    season_id = models.ForeignKey(Recruitment_season, on_delete=models.CASCADE, related_name='interview_year')

class Candidate_marks(models.Model):   
    # round_id = models.ForeignKey(Rounds, on_delete=CASCADE, related_name='id')
    applicant_id = models.ForeignKey(Applicant, on_delete = models.CASCADE, related_name='applicant_enrollment_no')
    checked = models.BooleanField(default=False)
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question_mark_id')
    marks = models.FloatField()
    remarks = models.TextField()

class Project(models.Model):
    project_id=models.IntegerField(primary_key=True)
    project_name=models.CharField(max_length=200)
    details=models.TextField()
    marks=models.IntegerField()
    remarks=models.CharField(max_length=200)

    def __str__(self):
        return self.project_name

class Candidate_round(models.Model):   
    NOT_NOTIFIED = 'NN'
    NOTIFIED = 'N'
    IN_WAITING_ROOM = 'WR'
    IN_INTERVIEW = 'IN'
    COMPLETE = 'C'
    ABSENT = 'AB'
    SELECTED = 'S'
    DETAILS_CHOICES = [
        (NOT_NOTIFIED, 'Not Notified'),
        (NOTIFIED, 'Notified'),
        (IN_WAITING_ROOM, 'In waiting room'),
        (IN_INTERVIEW, 'In Interview'),
        (COMPLETE, 'Complete'),
        (ABSENT, 'Absent'),  
        (SELECTED, 'Selected'),
    ]
    round_id = models.ForeignKey(Rounds, on_delete=models.CASCADE, related_name='round_id')
    applicant_id = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name='round_enrollment_no')
    # project_id=models.ForeignKey(Project, on_delete=models.CASCADE, related_name="candidate_project")
    test=models.BooleanField()#if appeared for the test then value=1
    remark = models.TextField()
    status = models.CharField(max_length=2, choices=DETAILS_CHOICES, default=NOT_NOTIFIED)
    interview_panel = models.ForeignKey(Interview_panel, on_delete=models.CASCADE, related_name='panel_id')
    time_slot = models.CharField(max_length = 255)
    # season_id = models.ForeignKey(Recruitment_season, on_delete=models.CASCADE, related_name='season_id')

