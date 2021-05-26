import React, {FC, useEffect, useState} from 'react';
import { Form, Button, Input } from 'antd';
import WButton from '../../button';
import axios from 'axios';
import { useForm } from 'antd/lib/form/Form';
import { openNotification } from '../../../page/main';

interface TechnicalSupport {
    onFinish?: () => void;
}

const TechnicalSupport: FC<TechnicalSupport> = ({
    onFinish = () => {},
}) => {

    const [form] = useForm()
    const { TextArea } = Input;


    const onSubmitForm = (values: any) => {

        const bodyFormData = new FormData();
        bodyFormData.append('email', values.email);
        bodyFormData.append('question', values.question);

       axios({
            method: "post",
            url: "http://localhost:8000/question/",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(function (response) {
              //handle success
              console.log(response);
              if(response.statusText === 'OK')
                form.resetFields();
                openNotification( 'Вопрос отправлен', 'Ответ придет в ближайшее время', 'success');
                onFinish();
            })
            .catch(function (response) {
              //handle error
              openNotification( 'Ошибка', 'Что-то пошло не так');
            });

      };
      
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
     };

      const validateMessages = {
        required: 'Укажите ${label}',
        types: {
          email: 'Неверный email',
        },
      };


    return (
        <Form 
            {...layout}
            form={form}
            className='form-for-email-report'
            name="question-for-creater" 
            onFinish={onSubmitForm}
            validateMessages={validateMessages}
        >

      <Form.Item 
        name={['email']} 
        label="Ваш email" 
        rules={[{ type: 'email' }, {required: true, message: 'Укажите email'}]}>
        <Input />
      </Form.Item>

      <Form.Item 
        name='question' 
        label="Вопрос" 
        rules={[{required: true, message: 'Задайте вопрос'}]}>
          <TextArea rows={4} />
      </Form.Item>

      
 
      <Form.Item {...tailLayout} style={{textAlign: 'right'}}>
          
        <WButton 
            type="primary"
            htmlType="submit"
            text="Отправить"
            shape="round"
        />
      
      </Form.Item>
    </Form>

    )
}

export default TechnicalSupport;
