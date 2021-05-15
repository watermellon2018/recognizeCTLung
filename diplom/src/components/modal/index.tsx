import React, {FC, useEffect, useState, Children} from 'react';
import { Modal, Descriptions, Button, Space } from 'antd';
import './style.scss'

interface InfoI {
    isShow?: boolean;
    onCancel?: () => void;
    children?: React.ReactNode;
    titleModal?: string;
    width?: string | number;
}

const ModalW: FC<InfoI> = ({
    isShow = false,
    onCancel = () => {},
    children, 
    titleModal = '',
    width = 520,
}) => {


    return (

        <Modal
            className='watermellon__modal'
            title={titleModal}
            visible={isShow} 
            onCancel={onCancel}
            footer={null}
            width={width}
        >
            {children}

        </Modal>

    )

}

export default ModalW;
