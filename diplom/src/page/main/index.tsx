
import React, {FC, useEffect, useState} from 'react';
import { Button,notification,  Divider, Input, DatePicker, Radio, Form, message, Upload, Tooltip } from 'antd';
import { InfoCircleOutlined, HeatMapOutlined,
     CloudDownloadOutlined, QuestionOutlined, SlackOutlined, SendOutlined } from '@ant-design/icons';
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

    const openNotification = (mes: string) => {
        notification['error']({
          message: 'Заполните форму',
          description: mes,
          placement: 'bottomLeft'
        });
      };

    const [form] = useForm()

    const onFinish = (values:any) => {
      ;
        if(values['ct_load'] === undefined){
            openNotification('Вы забыли загрузить КТ снимок')
            return;
        }
        if(values['email'] === undefined){
            openNotification('Вы забыли указать email');
            return;
        }
        
        const mode = (values['mode'] === undefined) ? 'segmentation' : values['mode'];
      

        const param: PersonalSetting = {
            name: values['name'],
            last_name: values['last_name'],
            father_name: values['father_name'],
            birthday: values['birthday'],
            email: values['email'],
            ct: values['ct_load']['file']['originFileObj']
        }

        console.log({...param});
        const bodyFormData = new FormData();
        bodyFormData.append('email', param.email);
        bodyFormData.append('ct', values['ct_load']['file']['originFileObj']);
        console.log(values['ct_load'])


        axios({
            method: "post",
            url: "http://localhost:8000/recognize/",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(function (response) {
              //handle success
              console.log(response);
            })
            .catch(function (response) {
              //handle error
              console.log(response);
            });
       /*API.post('recognize/', {...param}).then(res => {
            console.log(res);
        })*/
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

    /*const onFinish = (values: any) => {
        console.log(values);
    };*/

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
                            action='/loading/'
                            //action="http://localhost:8000/loading/"
                            //onChange={handleUpload}
                            multiple={false}
                            showUploadList={false}
                            maxCount={1}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Нажмите или перетащите файл для загрузки</p>
                        </Dragger>
                        </Form.Item>
                        
                    </div>
          

                    
                    <div>
                        <FormSetting onFinish={onFinish} />
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