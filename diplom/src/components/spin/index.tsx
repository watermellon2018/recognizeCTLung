import React, {FC, useEffect, useState, Children} from 'react';
import { Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


interface SpinI {
    children?: React.ReactNode | null;
    visible?: boolean;
}

const SpinW: FC<SpinI> = ({
    visible = false,
    children, 
}) => {
    if(!visible)
        return (
        <>
            {children}
        </>);


    return (
        
        <Spin
            size='large'
            tip='Анализ'
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        >
            {children}

        </Spin>

    )

}

export default SpinW;
