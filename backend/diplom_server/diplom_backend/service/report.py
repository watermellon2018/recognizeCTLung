''' Формирование отчета в pdf и отправка его на email'''
from PIL import Image
import io
import cv2
import fitz
import numpy as np

''' В функцию передается КТ снимок и его маска'''
def make_report(ct, mask):


    # TODO:: разобраться с типами
    if ct.dtype == np.uint8:
        ct = ct.astype(np.int16)

    ct_norm = cv2.normalize(ct, None, 0, 255, norm_type=cv2.NORM_MINMAX)
    ct_with_segmentation = apply_mask(ct_norm, mask)
    doc_gen = record_img(ct_with_segmentation)

    return doc_gen
    # doc_gen.save('report.pdf')

def image_to_stream(image):
  rgb = Image.fromarray(image, mode='RGB')
  img_byte_arr = io.BytesIO()
  rgb.save(img_byte_arr, format='PNG')
  return img_byte_arr.getvalue()

def apply_mask(img, m):
  for ind, x in enumerate(img):
    tmp = (m[ind] - 1) * (-1)
    img[ind] *= tmp
  return img


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

