import React, {FC, useEffect, useState} from 'react';
import { Button, Divider, Input, DatePicker, Radio, Form, message, Upload, Tooltip } from 'antd';
import { InfoCircleOutlined, HeatMapOutlined,
     CloudDownloadOutlined, QuestionOutlined, SlackOutlined, SendOutlined } from '@ant-design/icons';
import '../style.scss';

interface SettingAnalysI {
}

const SettingAnalys: FC = ({}) => {


      const validateMessages = {
        required: 'Укажите ${label}',
        types: {
          email: 'Не верный email',
        },
      };


    return (
        <>
            <Divider orientation='right' plain={true}>Настройки:</Divider>
                    
            <Form.Item 
                name={['email']}
                label="Email"
                required={true} 
                rules={[{ type: 'email' }]}
            >
                <Input minLength={5} maxLength={255} allowClear style={{width: "50%"}} />
            </Form.Item>

            <Form.Item name="mode" label="Режим">
                <Radio.Group>
                    <Radio value="segmentation">Сегментация</Radio>
                    <Radio value="detection">Детекция</Radio>
                </Radio.Group>
            </Form.Item>
        </>

    )
}

export default SettingAnalys;