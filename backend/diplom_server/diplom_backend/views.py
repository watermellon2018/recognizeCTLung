from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from diplom_backend.service.email import make_and_send_report
from diplom_backend.service.recognize import run_model
import SimpleITK as sitk

# TODO:: перенести в другой файл
def load_image(filename):
    image = sitk.ReadImage(filename)
    ct_scan = sitk.GetArrayFromImage(image)

    return ct_scan
# TODO:: передать КТ
@api_view(['POST'])
def report(request):
    email = request.data['param']['email']
    make_and_send_report(email)
    return Response('email true')

@api_view(['GET'])
def recognize(request):
    email = 'stepanovaks99@mail.ru'

    ct = load_image('/home/ytka/workspace/diplom/dataset/study_0302.nii.gz')
    # mask = load_image('/home/ytka/workspace/diplom/dataset/study_0302_mask.nii.gz')

    mask = run_model(ct) # TODO:: передать кт
    print('got mask from model')
    make_and_send_report(ct, mask, email)
    return Response('recognized')

@api_view(['GET', 'POST'])
def hello(request):
    print('heeee')
    if request.method == 'GET':
        return Response('hello')

@api_view(['GET', 'POST'])
def test(request):
    print('test test')
    print(request)
    return Response('test')


def index(request):
    print('test')
    return HttpResponse("Hello, World!")

