''' Формирование отчета в pdf и отправка его на email'''
from PIL import Image
import io
import cv2
import numpy as np
import fitz
import datetime

''' В функцию передается КТ снимок и его маска'''
def make_report(ct_preprocessed, mask, data_for_report):


    # TODO:: разобраться с типами
    if ct_preprocessed.dtype == np.uint8:
        ct_preprocessed = ct_preprocessed.astype(np.int16)

    ct_preprocessed = np.squeeze(ct_preprocessed)

    # if(data_for_report['mode'] == 'detect')
    #     is_detection = True
    is_detection = True if data_for_report['mode'] == 'detect' else False
    ct_with_contours = apply_contours(ct_preprocessed, mask, is_detection)

    print('data_for_report = ', data_for_report)
    V = np.round(float(data_for_report['volume_lesion']), 3)
    V_left = np.round(float(data_for_report['volume_lesion_left']), 3)
    V_right = np.round(float(data_for_report['volume_lesion_right']), 3)

    type_homogen = get_type_homogen(V)


    text_for_ct = "Дата: " + datetime.datetime.now().strftime(
        '%H:%M %d.%m.%Y') + \
        "\n\nДанные о пациенте\n" + \
                  "\nПациент: " + data_for_report['name'] + " " + data_for_report['father_name'] + \
                  " " + data_for_report['last_name'] + "\n" + \
                  "Дата рождения: " + data_for_report['birthday'] +"\n" + type_homogen + \
        "\nЖалобы: ДОБАВИТЬ ЖАЛОБЫ!" + \
        "\n\nРезультаты анализа\n" + \
            "\nПроцент поражения лекгих: " + str(V) + "%" + \
            "\nПроцент поражения левого легкого: " + str(V_left) + "%" + \
            "\nПроцент поражения правого легкого: " + str(V_right) + "%" + \
        ""



    doc_gen = record_img(ct_with_contours, text_for_ct)

    return doc_gen

def get_type_homogen(V):
    type_homogen = "Малая гомогенность"

    if V > 30 and V < 60:
        type_homogen = "Средняя гомогенность"
    elif V >= 60:
        type_homogen = "Высокая гомогенность"

    return type_homogen

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




fontsize = 14
padding_left_report = 40


def make_title_report(report_page):
    report_text = fitz.TextWriter(report_page.rect, color='black')
    report_text.append(pos=fitz.Point(40, 30), text="Анализ КТ снимка грудной клетки", language='ru', fontsize=16)
    return report_text


def write_analys_text(report_text, text):
    last_pos = 70

    for line in text.split("\n"):
        report_text.append(pos=fitz.Point(padding_left_report, last_pos), text=line, language='ru', fontsize=fontsize)
        last_pos = last_pos + 15

    return report_text, last_pos


def record_img(imgs, text=None):
    doc = fitz.open()
    doc.insertPage(pno=0)
    report_page = doc[-1]

    report_text = make_title_report(report_page)
    report_page.drawLine(fitz.Point(padding_left_report, 40), fitz.Point(550, 40))

    report_text, last_pos = write_analys_text(report_text, text)
    #report_page.writeText(writers=report_text)
    report_page.drawLine(fitz.Point(padding_left_report, last_pos + 10), fitz.Point(550, last_pos + 10))

    test_post_scriptum = "\n\nПри объеме поражения близким к нулю, следует считать, что легкие здоровые.\n" + \
                         "\nВнимание!\nРезультаты анализа не нужно принимать за единственно верный результат.\n" + \
                         "Чтобы принимать дальнейшие действия, необходима ОБЯЗАТЕЛЬНАЯ \nконсультация врача!" + \
                         "В случае неутешительного результата, ни в коем случае \nне нужно подаваться панике или опускать руки." + \
                         "Программа может ошибаться, \nпоэтому необходимо обратиться к специалистам для дальнейшей консультации,\n" + \
                         "а лучше к нескольким"

    for line in test_post_scriptum.split("\n"):
        report_text.append(pos=fitz.Point(padding_left_report, last_pos), text=line, language='ru', fontsize=fontsize)
        last_pos = last_pos + 15
    report_page.writeText(writers=report_text)



    number_page = 1
    doc.insertPage(pno=number_page)
    report_page = doc[number_page]

    cur_writer = fitz.TextWriter(report_page.rect, color='black')

    padding_left, padding_top = padding_left_report, 30  # 20, 20
    x, y = padding_left, padding_top

    margin_right, margin_bottom = 10, 20
    box = report_page.rect
    SIZE = int(box[2] / 5 + margin_right * 5)

    for number_slice, tmp in enumerate(imgs):
        # tmp = convert_to_rgb(tmp)
        tmp = image_to_stream(tmp)

        x2 = x + SIZE
        y2 = y + SIZE

        report_page.insertImage(rect=fitz.Rect(x, y, x2, y2), stream=tmp)
        cur_writer.append(pos=fitz.Point(x, y - 6), text="Срез №" + str(number_slice + 1), language='ru', fontsize=12)

        x += SIZE + margin_right
        if x + SIZE > box[2]:

            if y + 2 * SIZE + margin_bottom > box[3]:
                report_page.writeText(writers=cur_writer)
                number_page += 1
                doc.insertPage(pno=number_page)
                report_page = doc[number_page]
                x = padding_left
                y = padding_top
                cur_writer = fitz.TextWriter(report_page.rect, color='black')
            else:
                x = padding_left
                y += SIZE + margin_bottom

    report_page.writeText(writers=cur_writer)
    return doc

# def record_img(imgs):
#     doc = fitz.open()
#     doc.insertPage(pno=0)
#     report_page = doc[-1]
#
#     padding_left, padding_top = 20, 20
#     x, y = padding_left, padding_top
#
#     margin_right, margin_bottom = 10, 10
#     box = report_page.rect
#     SIZE = int(box[2] / 5 + margin_right * 5)
#     number_page = 0
#
#     for tmp in imgs:
#         if len(tmp.shape) < 3 or tmp.shape[2] != 3:
#             tmp = convert_to_rgb(tmp)
#         tmp = image_to_stream(tmp)
#
#         x2 = x + SIZE
#         y2 = y + SIZE
#
#         report_page.insertImage(rect=fitz.Rect(x, y, x2, y2), stream=tmp)
#         x += SIZE + margin_right
#         if x + SIZE > box[2]:
#
#             if y + 2 * SIZE + margin_bottom > box[3]:
#                 number_page += 1
#                 doc.insertPage(pno=number_page)
#                 report_page = doc[number_page]
#                 x = padding_left
#                 y = padding_top
#             else:
#                 x = padding_left
#                 y += SIZE + margin_bottom
#     return doc
#
