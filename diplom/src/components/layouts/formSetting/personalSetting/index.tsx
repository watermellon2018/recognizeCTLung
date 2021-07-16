import React, {FC, useEffect, useState} from 'react';
import { Divider, Input, DatePicker, Form } from 'antd';
import locale from 'antd/es/date-picker/locale/ru_RU';

import '../style.scss';

const PersonalSettingForm: FC = ({}) => {
    const { TextArea } = Input;



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
                        rules={[{pattern: new RegExp(/^[a-zA-Zа-яА-я ]*$/), message: 'Введите отчество'}]}
                    >
                        <Input allowClear maxLength={255} style={{maxWidth: "150px"}} />
                    </Form.Item>
    
            </div>

            <div style={{display: 'flex', alignItems: 'flex-end', flexDirection:'column'}}>
                <Form.Item 
                    name={['last_name']}
                    label="Фамилия"
                    rules={[{pattern: new RegExp(/^[a-zA-Zа-яА-я ]*$/), message: 'Введите фамилию'}]}
                >
                    <Input allowClear maxLength={255} style={{maxWidth: "150px"}} />
                </Form.Item>
    

                <Form.Item
                    name={['birthday']}
                    label="Дата рождения"
                >
                    <DatePicker locale={locale} placeholder='Выберете дату' style={{maxWidth: '150px' }} />
                </Form.Item>
            </div>
            
        </div>

        <div>
                <Form.Item
                    name={['complaints']}
                    label="Жалобы"
                >
                    <TextArea rows={4} />
                </Form.Item>
            </div>

    </>

    )
}

export default PersonalSettingForm;