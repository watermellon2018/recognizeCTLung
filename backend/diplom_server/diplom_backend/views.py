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
def loading(request):
    f = request.FILES['file']

    path = do_work_user_ct(f)

    email = 'stepanovaks99@mail.ru'
    ct = load_image(path)
    ct_preprocess = preprocess(ct)
    mask = run_model(ct_preprocess)
    # print('ct = ', ct)
    # data = json.dumps(ct.tolist())
    # print(data)

    # ct_str = "".join(str(e) for e in ct.tolist())
    # print(ct_str)

    make_and_send_report(ct_preprocess, mask, email)
    # return Response('{\"ct\": ' + ct_str)
    return Response('hell')

@api_view(['GET', 'POST'])
def test(request):
    print('test test')
    print(request)
    return Response('test')


def index(request):
    print('test')
    return HttpResponse("Hello, World!")

