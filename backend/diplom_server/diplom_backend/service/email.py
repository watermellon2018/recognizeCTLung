import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate
import SimpleITK as sitk
from diplom_backend.service.report import make_report

'''
    Отправка сформированного отчета на email
'''

def make_and_send_report(ct, mask, email):
    print('email is = ', email)
    doc_gen = make_report(ct, mask)
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