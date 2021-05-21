import React, {FC, useEffect, useState} from 'react';
import { Divider, Input, Radio, Form } from 'antd';
import '../style.scss';

const SettingAnalys: FC = ({}) => {

    return (
        <>
            <Divider orientation='right' plain={true}>Настройки:</Divider>
                    
            <Form.Item 
                name={['email']}
                label="Email"
                rules={[{ required: true, message: 'Введите email' },
                    {type: 'email', message: 'Введите корректный email'}]}
            >
                <Input minLength={5} maxLength={255} allowClear style={{width: "50%"}} />
            </Form.Item>

            <Form.Item initialValue='segmentation' name="mode" label="Режим">
                <Radio.Group>
                    <Radio value="segmentation">Сегментация</Radio>
                    <Radio value="detection">Детекция</Radio>
                </Radio.Group>
            </Form.Item>
        </>

    )
}

export default SettingAnalys;