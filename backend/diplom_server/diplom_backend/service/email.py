import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate
from diplom_backend.service.report import make_report

'''
    Отправка сформированного отчета на email
'''

def send_question_to_email(target, question):
    subject = "Вопрос техподдержке"
    mail = "stepanovaks99@mail.ru"

    question += '\nОтвет присылать на эту почту: ' + target

    server = smtplib.SMTP('smtp.mail.ru', 587)
    server.ehlo()
    server.starttls()
    server.login(mail, 'Lena_05')

    msg = MIMEMultipart()
    msg['From'] = mail
    msg['To'] = mail
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject
    msg.attach(MIMEText(question))

    server.sendmail(mail, mail, msg.as_string())
    server.quit()
    server.close()


def make_and_send_report(ct, mask, data_for_report):
    email = data_for_report['email']
    mask = mask.numpy()
    ct = ct.numpy()
    doc_gen = make_report(ct, mask, data_for_report)
    print('generated report')
    send_email(email, doc_gen)
    print('email sended')

    return True


def send_email(target, doc_gen):
    subject = "Анализ КТ"
    mail = "stepanovaks99@mail.ru"
    text = "Добрый день! Отправляем Вам результаты анализа Вашего КТ снимка легких"

    server = smtplib.SMTP('smtp.mail.ru', 587)
    server.ehlo()
    server.starttls()
    server.login(mail, 'Lena_05')

    msg = MIMEMultipart()
    msg['From'] = mail
    msg['To'] = target
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject
    msg.attach(MIMEText(text))

    byte_file = doc_gen.convert_to_pdf()
    part = MIMEApplication(
        byte_file,
        Name='report.pdf'
    )
    part['Content-Disposition'] = 'attachment; filename="%s"' % 'report.pdf'
    msg.attach(part)

    server.sendmail(mail, target, msg.as_string())
    server.quit()
    server.close()