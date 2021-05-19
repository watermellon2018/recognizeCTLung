
import React, {FC, useEffect, useState} from 'react';
import { Button, Divider, Input, DatePicker, Radio, Form, message, Upload, Tooltip } from 'antd';
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

const { Dragger } = Upload;



interface AnalisCTI {

};

const AnalisCT: FC<AnalisCTI> = () => {

    const handleUpload = (e:any) => {
        console.log(e);
    }


    const [isShowInfo, setIsShowInfo] = useState(false);
    const [isShowEmailModal, setIsShowEmailModal] = useState(false);

    const showInformation = () => {
        setIsShowInfo(true);        
    }
    const showEmailModal = () => {
        setIsShowEmailModal(true);
    }

    const closeEmailModal = () => {
        setIsShowEmailModal(false);
    }

    const closeInfo = () => {
        setIsShowInfo(false);
    }

    const onFinish = (values: any) => {
        console.log(values);
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

                    <div className="watermellon__main__wrap__uploader" style={{marginBottom: '30px'}}>
                        <Dragger 
                            action="http://localhost:8000/loading/"
                            onChange={handleUpload}
                            multiple={false}
                            showUploadList={false}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Нажмите или перетащите файл для загрузки</p>
                        </Dragger>
                    </div>
          

                    
                    <div style={{width: "70%"}}>
                        <FormSetting onFinish={onFinish} />
                    </div>

                   
                
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