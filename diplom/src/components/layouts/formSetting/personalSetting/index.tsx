import React, {FC, useEffect, useState} from 'react';
import { Button, Divider, Input, DatePicker, Radio, Form, message, Upload, Tooltip } from 'antd';
import { InfoCircleOutlined, HeatMapOutlined,
     CloudDownloadOutlined, QuestionOutlined, SlackOutlined, SendOutlined } from '@ant-design/icons';
import '../style.scss';

const PersonalSettingForm: FC = ({}) => {



    return (
        <>
            <Divider orientation='right' plain={true}>Персональные данные:</Divider>

            <div className='watermellon__main__wrap__personal'>
                <div style={{display: 'flex', alignItems: 'flex-end', flexDirection:'column', marginRight: '10px'}}>
                    <Form.Item 
                        name={['name']}
                        label="Имя"
                        rules={[{pattern: new RegExp(/^[a-zA-Zа-яА-я ]*$/), message: 'Введите имя'}]}
                    >
                        <Input allowClear maxLength={255} style={{maxWidth: "150px"}} />
                    </Form.Item>

                    <Form.Item 
                        name={['father_name']}
                        label="Отчество"
                        rules={[{pattern: new RegExp(/^[a-zA-Zа-яА-я ]*$/), message: 'Введите фамилию'}]}
                    >
                        <Input allowClear maxLength={255} style={{maxWidth: "150px"}} />
                    </Form.Item>
    
            </div>

            <div style={{display: 'flex', alignItems: 'flex-end', flexDirection:'column'}}>
                <Form.Item 
                    name={['last_name']}
                    label="Фамилия"
                    rules={[{pattern: new RegExp(/^[a-zA-Zа-яА-я ]*$/), message: 'Введите отчество'}]}
                >
                    <Input allowClear maxLength={255} style={{maxWidth: "150px"}} />
                </Form.Item>
    

                <Form.Item
                    name={['birthday']}
                    label="Дата рождения"
                >
                    <DatePicker style={{maxWidth: '150px' }} />
                </Form.Item>
            </div>
        </div>

    </>

    )
}

export default PersonalSettingForm;