''' Формирование отчета в pdf и отправка его на email'''
import torch
from PIL import Image
import io
import cv2
import fitz
import numpy as np

''' В функцию передается КТ снимок и его маска'''
def make_report(ct_preprocessed, mask):


    # TODO:: разобраться с типами
    if ct_preprocessed.dtype == np.uint8:
        ct_preprocessed = ct_preprocessed.astype(np.int16)

    ct_preprocessed = np.squeeze(ct_preprocessed)
    print(ct_preprocessed.shape)
    ct_with_contours = apply_contours(ct_preprocessed, mask, True)
    print(ct_with_contours.shape)
    doc_gen = record_img(ct_with_contours)

    return doc_gen

def detection(contours, ct_rgb):
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        cv2.rectangle(ct_rgb, (x, y), (x + w, y + h), (0, 255, 0), 1)
    return ct_rgb

def apply_contours(ct_norm, mask, is_detection = False):
    ts = []
    for ind, x in enumerate(mask):
        contours = get_img_with_contours(x.copy())
        ct_rgb = convert_to_rgb(ct_norm[ind])

        if is_detection:
            ct_rgb = detection(contours, ct_rgb)
        else:
            ct_rgb = cv2.drawContours(ct_rgb, contours, -1, (255, 0, 0), 1)
            # for c in contours:
            #     x, y, w, h = cv2.boundingRect(c)
            #     cv2.rectangle(ct_rgb, (x, y), (x + w, y + h), (0, 255, 0), 1)

        # ct_rgb = cv2.drawContours(ct_rgb, contours, -1, (255, 0, 0), 1)
        ts.append(ct_rgb)

    ts = np.array(ts)
    return ts


def get_img_with_contours(origin):
    img = convert_to_rgb(origin)
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    ret, thresh = cv2.threshold(gray, 2, 5, 0)
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    return contours

def image_to_stream(image):
  rgb = Image.fromarray(image, mode='RGB')
  img_byte_arr = io.BytesIO()
  rgb.save(img_byte_arr, format='PNG')
  return img_byte_arr.getvalue()


def convert_to_rgb(img):
  norm_img = cv2.normalize(img, None, 0, 255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1)
  rgb_im = cv2.cvtColor(norm_img, cv2.COLOR_GRAY2RGB)

  return rgb_im


def record_img(imgs):
    doc = fitz.open()
    doc.insertPage(pno=0)
    report_page = doc[-1]

    padding_left, padding_top = 20, 20
    x, y = padding_left, padding_top

    margin_right, margin_bottom = 10, 10
    box = report_page.rect
    SIZE = int(box[2] / 5 + margin_right * 5)
    number_page = 0

    for tmp in imgs:
        if len(tmp.shape) < 3 or tmp.shape[2] != 3:
            tmp = convert_to_rgb(tmp)
        tmp = image_to_stream(tmp)

        x2 = x + SIZE
        y2 = y + SIZE

        report_page.insertImage(rect=fitz.Rect(x, y, x2, y2), stream=tmp)
        x += SIZE + margin_right
        if x + SIZE > box[2]:

            if y + 2 * SIZE + margin_bottom > box[3]:
                number_page += 1
                doc.insertPage(pno=number_page)
                report_page = doc[number_page]
                x = padding_left
                y = padding_top
            else:
                x = padding_left
                y += SIZE + margin_bottom
    return doc

