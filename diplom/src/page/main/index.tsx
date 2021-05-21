
import React, {FC, useEffect, useState} from 'react';
import { Result, notification,  Divider, Input, DatePicker, Radio, Form, message, Upload, Tooltip } from 'antd';
import { QuestionOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './style.scss';
import WButton from '../../components/button';
import axios from 'axios';
import API from "../../utils/API";
import Info from '../../components/layouts/info';
import ModalW from '../../components/modal';
import Email from '../../components/layouts/email';
// import { Uploader } from 'rsuite';
import { InboxOutlined } from '@ant-design/icons';
import FormSetting from '../../components/layouts/formSetting';
import '../../components/layouts/formSetting/style.scss';
import { useForm } from 'antd/lib/form/Form';

const { Dragger } = Upload;

interface AnalisCTI {

};
interface PersonalSetting {
    name?: string;
    last_name?: string;
    father_name?: string;
    birthday?: string;
    email: string;
    ct: any;
};

const AnalisCT: FC<AnalisCTI> = () => {

    const [ isSelectFile, setIsSelectFile ] = useState(false);
    const [form] = useForm()


    const openNotification = (mes: string, description: string) => {
        notification['error']({
          message: mes,
          description,
          placement: 'bottomLeft', 
        });
      };


    const onFinish = (values:any) => {
      ;
        if(values['ct_load'] === undefined){
            openNotification( 'Заполните форму', 'Вы забыли загрузить КТ снимок')
            return;
        }

        if(values['email'] === undefined){
            openNotification( 'Заполните форму', 'Вы забыли указать email');
            return;
        }
        
        const mode = (values['mode'] === undefined) ? 'segmentation' : values['mode'];
        const name = (values['name'] === undefined || values['name'].length === 0) ? '---' : values['name'];
        const last_name = (values['last_name'] === undefined || values['last_name'].length === 0) 
                            ? '---' : values['last_name'];
        const father_name = (values['father_name'] === undefined || values['father_name'].length === 0)
                            ? '---' : values['father_name'];
        const birthday = (values['birthday'] === undefined) ? '---' : values['birthday'];
        console.log('values = ', values)

      

        const param: PersonalSetting = {
            name,
            last_name,
            father_name,
            birthday,
            email: values['email'],
            ct: values['ct_load']['file']['originFileObj']
        }

        console.log({...param});
        const bodyFormData = new FormData();
        bodyFormData.append('email', values.email);
        bodyFormData.append('mode', mode);
        bodyFormData.append('name', name);
        bodyFormData.append('last_name', last_name);
        bodyFormData.append('father_name', father_name);
        bodyFormData.append('birthday', birthday);
        bodyFormData.append('ct', values['ct_load']['file']['originFileObj']);


        axios({
            method: "post",
            url: "http://localhost:8000/recognize/",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(function (response) {
              //handle success
              console.log(response);
              if(response.statusText === 'OK')
                setIsSelectFile(false);
                openNotification( 'Обработка завершена', 'КТ снимок обработан. Результаты отправлены на почту');
            })
            .catch(function (response) {
              //handle error
              console.log(response);
              openNotification( 'Ошибка', 'Что-то пошло не так');
            });
    }


    const [isShowInfo, setIsShowInfo] = useState(false);
    const [isShowEmailModal, setIsShowEmailModal] = useState(false);

    const showInformation = () => {
        setIsShowInfo(true);        
    }


    const closeEmailModal = () => {
        setIsShowEmailModal(false);
    }

    const closeInfo = () => {
        setIsShowInfo(false);
    }

    const onChange = (file: any) => {
        console.log(file)
        console.log(file.fileList.length)
        if(file.fileList.length > 0)
            setIsSelectFile(true);
    }


    const layout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
    };
      
    
    return (
        <div className="watermellon__main">
            <div className="watermellon__main__wrap">
                    <div className="watermellon__main__wrap__info">
                    <WButton
                        onClick={showInformation}
                        size='large'
                        shape="circle"
                        isHint={true}
                        tooltip="Информация"
                        icon={<QuestionOutlined />}
                    />
                    </div>
                    
                    <Form
                        form={form}
                        {...layout}
                        name="setting"
                        onFinish={onFinish}
                    >
                    <div className="watermellon__main__wrap__uploader" style={{marginBottom: '30px'}}>
                        
                            <Form.Item name='ct_load'>
                        <Dragger 
                            onChange={onChange}
                            action='/loading/'
                            multiple={false}
                            showUploadList={false}
                            maxCount={1}
                        >
                            {isSelectFile ? 
                                <Result
                                    style={{padding: '0'}}
                                    status="success"
                                    title="Файл выбран"
                                /> 
                                :
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p> 
                            }
                            <p className="ant-upload-text">Нажмите или перетащите файл для загрузки</p>
                        </Dragger>
                        </Form.Item>
                        
                    </div>
          

                    
                    <div>
                        <FormSetting />
                    </div>
                    </Form>

                   
                
                <ModalW 
                    isShow={isShowInfo}
                    onCancel={closeInfo}
                    titleModal='Информация о программе'
                >
                    <Info />  
                </ModalW>

                <ModalW 
                    width={400}
                    isShow={isShowEmailModal}
                    onCancel={closeEmailModal}
                    titleModal='Отправить отчет'
                >
                    <Email />
                </ModalW>

            </div>        
      </div>
    )

};


export default AnalisCT;