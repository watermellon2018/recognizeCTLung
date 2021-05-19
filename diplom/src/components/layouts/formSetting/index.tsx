import React, {FC, useEffect, useState} from 'react';
import { Form, Button } from 'antd';
import './style.scss';
import PersonalSettingForm from './personalSetting';
import SettingAnalys from './settingAnalys';

interface FormSettingI {
    onFinish?: (values: any) => void;
}

const FormSetting: FC<FormSettingI> = ({onFinish = () => {}}) => {

    const layout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
    };

    const tailLayout = {
       wrapperCol: { offset: 8, span: 16 },
    };

      const validateMessages = {
        required: 'Укажите ${label}',
        types: {
          email: 'Не верный email',
        },
      };


    return (
        <Form
            {...layout}
            name="setting"
            onFinish={onFinish}
        >
            <SettingAnalys />
            <PersonalSettingForm />
            
                 
      
            <Form.Item {...tailLayout} style={{float: 'right'}}>
                <Button style={{float: 'right'}} type="primary" htmlType="submit">
                    Отправить
                </Button>
            </Form.Item>
        </Form>

    )
}

export default FormSetting;