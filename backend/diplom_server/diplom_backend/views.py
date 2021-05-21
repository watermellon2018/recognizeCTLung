import threading

from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from diplom_backend.service.email import make_and_send_report
from diplom_backend.service.recognize import run_model
from diplom_backend.service.preprocess import preprocess
from diplom_backend.service.load import do_work_user_ct, load_image
from diplom_backend.service.segment_lung import get_volume_lesion, segmentation_lung


# TODO:: передать КТ
@api_view(['POST'])
def report(request):
    email = request.data['param']['email']
    make_and_send_report(email)
    return Response('email true')

# @api_view(['GET'])
# def recognize(request):
#     email = 'stepanovaks99@mail.ru'
#
#     ct = load_image('/home/ytka/workspace/diplom/dataset/study_0302.nii.gz')
#     ct_preprocess = preprocess(ct)
#     # ct_preprocess = ct
#     # mask = load_image('/home/ytka/workspace/diplom/dataset/study_0302_mask.nii.gz')
#
#     mask = run_model(ct_preprocess) # TODO:: передать кт
#     print('got mask from model')
#     make_and_send_report(ct_preprocess, mask, email)
#     return Response('recognized')

import json

# socket.send(data.encode())



@api_view(['POST'])
def recognize(request):
    print(request.data)


    f = request.FILES['ct']


    path = do_work_user_ct(f)

    # email = 'gfrv.rafael@gmail.com'
    ct, ct_matrix = load_image(path)

    mask_lung = segmentation_lung(ct)


    ct_preprocess = preprocess(ct_matrix)
    mask_lesion = run_model(ct_preprocess)

    volume_lesion = get_volume_lesion(mask_lung, mask_lesion)
    print(volume_lesion)

    data_for_report = {
        'name': request.data['name'],
        'last_name': request.data['last_name'],
        'father_name': request.data['father_name'],
        'birthday': request.data['birthday'],
        'volume_lesion': str(volume_lesion),
        'mode': request.data['mode'],
        'email': request.data['email'],
    }

    print('data_for_report before report = ', data_for_report)


    make_and_send_report(ct_preprocess, mask_lesion, data_for_report)
    return Response('hell')

@api_view(['GET', 'POST'])
def test(request):
    print('test test')
    print(request)
    return Response('test')


def index(request):
    print('test')
    return HttpResponse("Hello, World!")

