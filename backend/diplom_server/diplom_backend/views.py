import os
import threading

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from diplom_backend.service.email import make_and_send_report, send_question_to_email
from diplom_backend.service.recognize import run_model
from diplom_backend.service.preprocess import preprocess
from diplom_backend.service.load import get_path_to_file, load_image
from diplom_backend.service.segment_lung import get_volume_lesion, segmentation_lung


# TODO:: передать КТ
@api_view(['POST'])
def report(request):
    email = request.data['param']['email']
    make_and_send_report(email)
    return Response('email true')

@api_view(['POST'])
def question(request):
    print(request.POST)
    email = request.POST['email']
    question = request.POST['question']
    send_question_to_email(email, question)


    return Response('OK')

import numpy as np

@api_view(['POST'])
def recognize(request):

    file = request.FILES['ct']
    path, is_dir = get_path_to_file(file)
    print('path = ', path, 'is dir = ', is_dir)

    if is_dir:
        files_in_dir = os.listdir(path)
        name_file = [x for x in files_in_dir if x.split('.')[-1] == 'mhd'][0]
        path = os.path.join(path, name_file)
        print('path = ', path)

    ct, ct_matrix = load_image(path)
    print('loaded image')
    print('ct shape = ', ct_matrix.shape)
    mask_lung = segmentation_lung(ct)
    print('mask lung = ', mask_lung.shape)
    print('segmentated lung')

    ct_preprocess = preprocess(ct_matrix)
    mask_lesion = run_model(ct_preprocess)

    volume_lesion = get_volume_lesion(mask_lung, mask_lesion)
    print(volume_lesion)

    data_for_report = {
        'name': request.data['name'],
        'last_name': request.data['last_name'],
        'father_name': request.data['father_name'],
        'birthday': request.data['birthday'],
        'volume_lesion': str(volume_lesion['lung']),
        'volume_lesion_left': str(volume_lesion['left']),
        'volume_lesion_right': str(volume_lesion['right']),
        'mode': request.data['mode'],
        'email': request.data['email'],
    }

    make_and_send_report(ct_preprocess, mask_lesion, data_for_report)
    return Response('OK')
