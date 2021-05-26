import SimpleITK as sitk

import os
import uuid
import zipfile
from django.conf import settings


def get_path_to_file(file):
    path, is_dir = handle_uploaded_file(file)
    return path, is_dir


def handle_uploaded_file(f):
    is_dir = False
    uuid_str = str(uuid.uuid1())
    temp_name = uuid_str + "-" + f.name
    path = os.path.join(settings.BASE_DIR, 'temp', temp_name)

    with open(path, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

    if f.name.endswith('.zip'):
        temp_dir = os.path.join(settings.BASE_DIR, 'temp', temp_name.replace(".zip", ""))
        print('temp_dir = ', temp_dir)
        with zipfile.ZipFile(path, 'r') as zip_ref:
            zip_ref.extractall(os.path.join(settings.BASE_DIR, 'temp', temp_dir))
        is_dir = True
        os.remove(path)
        path = temp_dir

    return path, is_dir


def load_image(filename):
    image = sitk.ReadImage(filename)
    ct_scan = sitk.GetArrayFromImage(image)

    return image, ct_scan