
import React, {FC, useEffect, useState} from 'react';
import { Button, message, Upload, Tooltip } from 'antd';
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

    /*const testRecognize = () => {
        API.get('recognize/').then(res => {
            console.log(res);
        })
    }*/

    return (
        <div className="watermellon__main">
            <div className="watermellon__main__wrap">
                <div className="watermellon__main__wrap__menu">
                    
                    <Upload
                     listType='picture'
                     action="http://localhost:8002/loading/"
                     onChange={handleUpload}
                     multiple={false}
                     showUploadList={false}
                     >
                    <WButton
                        size='large'
                        shape="circle"
                        isHint={true} 
                        icon={<CloudDownloadOutlined />}
                        tooltip="Загрузка"
                    />
                    </Upload>

                    <WButton 
                        // onClick={testRecognize}
                        size='large'
                        shape="circle"
                        isHint={true}
                        tooltip="Оригинальный КТ"
                        icon={<SlackOutlined />}
                    />

                    <WButton
                        size='large'
                        shape="circle"
                        isHint={true}
                        tooltip="Сегментация"
                        icon={<HeatMapOutlined />}
                    />

                    <WButton 
                        onClick={showEmailModal}
                        size='large'
                        shape='circle'
                        isHint={true}
                        tooltip="Отправить отчет на email"
                        icon={<SendOutlined />}
                    />

                    <WButton
                        onClick={showInformation}
                        size='large'
                        shape="circle"
                        isHint={true}
                        tooltip="Информация"
                        icon={<QuestionOutlined />
                    }
                    />
                
                </div>

                <div className="watermellon__main__ct">


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