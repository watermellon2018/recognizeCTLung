import React, {FC, useEffect, useState} from 'react';
import { Modal, Form, Descriptions, Button, Space, Input } from 'antd';
import './style.scss'
import WButton from '../../button';
import API from '../../../utils/API';

interface EmailI {
    isShow?: boolean;
    onCancel?: () => void;
}

const Email: FC<EmailI> = ({
    isShow = false,
    onCancel = () => {}
}) => {

    const onFinish = (values: any) => {
        const param = {
          email: values.email
        };
        API.post('report/', {param}).then(res => {
          console.log(res);
        })
      };
      
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };

      const validateMessages = {
        required: 'Укажите ${label}',
        types: {
          email: 'Не верный email',
        },
      };


    return (
        <Form 
            className='form-for-email-report'
            name="email-for-report" 
            onFinish={onFinish}
            validateMessages={validateMessages}
        >

      <Form.Item name={['email']} label="Email" required={true} rules={[{ type: 'email' }]}>
        <Input />
      </Form.Item>
 
      <Form.Item style={{textAlign: 'right'}}>
          
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

export default Email;
