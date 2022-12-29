
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets
from rest_framework import permissions
from .models import *
from .serializers import *
from rest_framework.permissions import *
from rest_framework.decorators import action
from .permissions import *
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse, HttpResponseRedirect,HttpResponseBadRequest
import requests
from django.contrib.auth import login,logout,authenticate
import json
import pandas
from . import oauth

class RecruitmentSeasonViewSet(viewsets.ModelViewSet):
    queryset=Recruitment_season.objects.all()
    serializer_class=RecruitmentSeasonSerializer
    permission_classes=[AllowAny]
    # permission_classes=[SecYearPermission]
    

class RoundsViewSet(viewsets.ModelViewSet):
    queryset=Rounds.objects.all()
    serializer_class=RoundsSerializer
    permission_classes=[AllowAny]
    # permission_classes=[SecYearPermission]
    

class SectionViewSet(viewsets.ModelViewSet):
    queryset=Section.objects.all()
    serializer_class=SectionSerializer
    permission_classes=[AllowAny]
    # permission_classes=[SecYearPermission]
    def get_queryset(self):
        round_id=self.request.query_params.get('round_id')
        queryset=Section.objects.filter(round_id=round_id) 
        return queryset
    
    @action(detail=False)
    def get_sections(self,request): #used in TestTable of Dashboard
        round_id=self.request.query_params.get('round_id')
        sections=Section.objects.filter(round_id=round_id).values()
        for s in sections:
            ques_list=Question.objects.filter(section_id=s['id']).values()
            for ques in ques_list:
                assignee=Users.objects.get(enrollment_no=ques['assignee'])
                ques.update({'assigned_to_name':assignee.name})
            s.update({"ques_list":ques_list})
        res=Response(sections)
        return res

    @action(detail=False,methods=['POST'])
    def create_section(self,request): 
        
        round_id=request.data['round_id']
        weightage=request.data['percent_weightage']
        section_name=request.data['section_name']
        round=Rounds.objects.get(id=round_id)
        section=Section(name=section_name,weightage=weightage,round=round)
        section.save()
        return HttpResponse("HTTP 200 OK")

class QuestionViewSet(viewsets.ModelViewSet):
    queryset=Question.objects.all()
    serializer_class=QuestionSerializer
    permission_classes=[AllowAny]
    # permission_classes=[SecYearPermission]
    
    def get_queryset(self):
        section_id=self.request.query_params.get('section_id')
        queryset=Question.objects.filter(section_id=section_id) 
        return queryset

    @action(detail=False,methods=['POST'])
    def create_question(self,request): 
        section_id=request.data['id']
        q_id=request.data['q_id']
        q_text=request.data['q_text']
        assignee=request.data['assigned_to']
        marks=request.data['total_marks']
        question = Question(id=q_id, text=q_text, assignee=assignee, section_id=section_id,marks=marks)
        question.save()
        return HttpResponse("HTTP 200 OK")

    @action(detail=False,methods=['POST'])
    def update_question(self,request): #used in Test
        
        q_id=request.data['q_id']
        q_text=request.data['q_text']
        assignee=request.data['assigned_to']
        marks=request.data['total_marks']
        ques=Question.objects.get(id=q_id)
        ques.text=q_text
        ques.assignee=assignee
        ques.marks=marks
        ques.save()
        return HttpResponse("HTTP 200 OK")

class ApplicantViewSet(viewsets.ModelViewSet):
    queryset=Applicant.objects.all()
    serializer_class=ApplicantSerializer
    permission_classes=[AllowAny]
    # permission_classes=[SecYearPermission]
         

class UsersViewSet(viewsets.ModelViewSet):
    queryset=Users.objects.all()
    serializer_class=UsersSerializer
    permission_classes=[AllowAny]
    
    @action(detail=False)
    def info(self,request):
        info=UsersSerializer(request.user)
        res=Response(info.data, status=status.HTTP_202_ACCEPTED)

    
class UsersLoginViewSet(viewsets.ModelViewSet):
    queryset=Users.objects.all()
    serializer_class=UsersSerializer
    
    @action(detail=False, methods=['POST'])
    def log_in(self, req):
        try:
            auth_code=req.data['code']
        except:
            return HttpResponseBadRequest()

        params = {
            'client_id': oauth.CLIENT_ID,
            'client_secret': oauth.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'redirect_uri': oauth.REDIRECT_URI,
            'code': auth_code,
        }

        res = requests.post("https://channeli.in/open_auth/token/", data=params,)
        
        if(res.status_code==200):
            access_token=res.json()["access_token"]
            refresh_token=res.json()["refresh_token"]
        else:
            return HttpResponseBadRequest()

        
        header={ "Authorization": "Bearer " + access_token,}

        res=requests.get("https://channeli.in/open_auth/get_user_data/",headers=header)

        user_data=res.json()
        isMaintainer=False

        for role in user_data['person']['roles']:
            if role['role'] == 'Maintainer':
                isMaintainer = True
                
            
        if not isMaintainer:
            return JsonResponse({'status': 'you are not a maintainer'})
        
        user,created=Users.objects.get_or_create(enrollment=user_data['username'], defaults={"name":user_data['person']['fullName'], "branch":user_data['student']['branch name'],"current_year":user_data['student']['currentYear']})
        login(req,user)

        res=Response(user_data,status=status.HTTP_202_ACCEPTED)
        return res



class ProjectViewSet(viewsets.ModelViewSet):
    queryset=Project.objects.all()
    serializer_class=ProjectSerializer
    permission_classes=[AllowAny]

class InterviewPanelViewSet(viewsets.ModelViewSet):
    queryset=Interview_panel.objects.all()
    serializer_class=InterviewPanelSerializer
    permission_classes=[AllowAny]
    
    # permission_classes=[SecYearPermission]
    
class CandidateMarksViewSet(viewsets.ModelViewSet):
    queryset=Candidate_marks.objects.all()
    serializer_class=CandidateMarksSerializer
    permission_classes=[AllowAny]
    # permission_classes=[SecYearPermission]

    def get_queryset(self):
        ques_id=self.request.query_params.get('ques_id')
        id=self.request.query_params.get('c_id')
        queryset=Candidate_marks.objects.filter(applicant_id=id,question_id=ques_id)        
        return queryset
    
    @action(detail=False,methods=['POST'])
    def update_marks(self,request):
        marks=request.data['marks']
        remarks=request.data['remarks']
        ques_id=request.data['ques_id']
        candidate_id=request.data['candidate_id']
        try:
            question=Candidate_marks.objects.get(applicant_id=candidate_id, question_id=ques_id)
            question.marks=marks
            question.remarks=remarks
            question.save()
        except question.DoesNotExist:            
            question.save()
            
        return HttpResponse("HTTP 200 OK")
    
    
class ProjectViewSet(viewsets.ModelViewSet):
    queryset=Project.objects.all()
    serializer_class=ProjectSerializer
    permission_classes=[AllowAny]
    # permission_classes=[SecYearPermission]
class CandidateRoundViewSet(viewsets.ModelViewSet):
    queryset=Candidate_round.objects.all()
    serializer_class=CandidateRoundSerializer
    permission_classes=[AllowAny]

    @action(detail=False,methods=['POST'])
    def info_from_csv(self,request): 
        info=pandas.read_csv(request.FILES['File'])
        for i in range (info.shape[0]):
            applicant,applicantCreated=Applicant.objects.get_or_create(enrollment_no= info['enrollment_no'][i], name=info['name'][i], email=info['email'][i], mob=info['mob'][i], cg=info['cg'][i])
            project,projectCreated=Project.objects.get_or_create(project_id=info['project_id'][i], project_name=info['project_name'][i],details=info['details'][i])
            season,seasonCreated=Recruitment_season.objects.get_or_create(year=info['recruitment_season'][i],role=info['role'][i])
            round,roundCreated=Rounds.objects.get_or_create(season_id=season, type=info['round_type'][i])
            CR = Candidate_round(applicant_id=applicant, project_id=project,test=info['test'][i],status=info['status'][i],round_id=round)
            CR.save()
        return HttpResponse("HTTP 200 OK")

    def get_queryset(self): #used in candidates list
        appeared_test=self.request.query_params.get('appeared_test')
        year=self.request.query_params.get('round_seasonid')
        round = Rounds.objects.filter(season_id=year)
        queryset = []
        if (round.exists()==True):
            for i in range(len(round)):
                if (appeared_test=='1'):
                    queryset=Candidate_round.objects.filter(test=appeared_test, round_id=round[i].id) 
                else:
                    queryset=Candidate_round.objects.filter( season_id=year)
        
        return queryset

    @action(detail=False)
    def get_marks(self,request): #used in TestTable of Dashboard
        round_id=self.request.query_params.get('round_id')
        candidates=Candidate_round.objects.filter(test=1,round_id=round_id).values()

        for candidate in candidates:
            candidate_data=Applicant.objects.get(enrollment_no=candidate['enrollment_no'])
            
            candidate.update({"enrollment_no":candidate_data.enrollment_no})
            candidate.update({"name":candidate_data.name})
            mark_list=[]
            section_total_list=[]
            sections=Section.objects.filter(round_id=round_id).values()
            for section in sections:
                sum=0
                ques_list=Question.objects.filter(section_id=section['id']).values()
                for ques in ques_list:
                    
                    marks=Candidate_marks.objects.get(applicant_id=candidate['enrollment_no'],question_id=ques['id']).marks
                    remarks=Candidate_marks.objects.get(applicant_id=candidate['enrollment_no'],question_id=ques['id']).remarks
                        
                    mark_list.append((ques['id'],marks,remarks))
                    if(marks!=None):
                        sum = sum + marks
                    
                total={"section_id":section['id'],"total":sum}
                section_total_list.append(total)
                    
            candidate.update({"mark_list":mark_list})
            candidate.update({"section_total_list":section_total_list})

        res=Response(candidates)
        return res

    @action(detail=False)
    def get_selected(self,request):#used in SelectedTable of Dashboard
        year=self.request.query_params.get('round_seasonid')
        round = Rounds.objects.filter(season_id=year)
        selected=[]
        if (round.exists()==True):
            for i in range(len(round)):                
                selected_candidates=Candidate_round.objects.filter(status='S',round_id=round[i].id).values()
                for c in selected_candidates:
                    candidate=Applicant.objects.get(enrollment_no=c['enrollment_no'])
                    c.update({"name":candidate.name})
                    c.update({"enrollment_no":candidate.enrollment_no})
                    c.update({"email":candidate.email})
                    c.update({"mob":candidate.mob})
                selected.append(selected_candidates)
        res=Response(selected)
        return res


    @action(detail=False,methods=['POST'])
    def move_to_selected(self,request): 
        id=request.data['candidate_id']
        c=Candidate_round.objects.get(Applicant_id=id)
        c.status='S'
        c.save()
        return HttpResponse('HTTP 200 OK')

    @action(detail=False,methods=['POST'])
    def move_to_interview(self,request): 
        candidate_id=request.data['candidate_id']
        round_id=request.data['round_id']
        year=Rounds.objects.get(id=round_id).season_id
        next_round=Rounds.objects.get(season_id=year, type='i').id
        c=Candidate_round.objects.get(Applicant_id=candidate_id)        
        
        c.round_id=next_round
        c.save()
        return HttpResponse('HTTP 200 OK')
# Create your views here.
