import React, {FC, useEffect, useState} from 'react';
import { Modal, Descriptions, Button, Space } from 'antd';
import './style.scss'

interface InfoI {
    isShow?: boolean;
    onCancel?: () => void;
}

const Info: FC<InfoI> = ({
    isShow = false,
    onCancel = () => {}
}) => {


    return (

 
            <table style={{width: '100%'}}>
                <tr style={{width: '50%'}}>
                    <td>
                        Создатель
                    </td>
                    <td>
                        Степанова Екатеринa
                    </td>
                    
                </tr>
                <tr style={{width: '50%'}}>
                    <td>
                        Email
                    </td>
                    <td>
                        stepanovaks99@mail.ru
                    </td>
                   
                </tr>
                <tr>
                    <td>
                        Как пользоваться?
                    </td>
                    <td>
                    В меню представлены 4 кнопки. Чтобы воспользовать программой загрузите КТ снимок в программу.
                    Это можно сделать, нажав на первую кнопку. После этого модель обработает сномок и покажется подозрительные участки.
                    Вы можете включить режим сегментации или детекции, понажимав третью кнопку.
                    Чтобы переключиться на оригинальный КТ снимок, воспользуйтесь второй кнопкой.
                    </td>

                </tr>
            </table>

    )

}

export default Info;
