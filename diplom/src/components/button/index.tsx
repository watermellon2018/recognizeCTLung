import React, {FC, useEffect, useState, ReactNode, CSSProperties} from 'react';
import { Button, Tooltip } from 'antd';

interface WButtonI {
    tooltip?: string;
    text?: string;
    icon?: ReactNode;
    shape?: 'circle' | 'round';
    isHint?: boolean;
    size?: 'large' | 'middle' | 'small';
    onClick?: () => void;
    type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
    htmlType?: 'button' | 'submit' | 'reset';
    style?: CSSProperties;
}

const WButton: FC<WButtonI> = ({
    isHint = false,
    shape = 'round',
    size = 'middle',
    tooltip, text, icon,
    onClick = () => {},
    type = 'default',
    htmlType = 'button',
    style = {}
}) => {


    if(isHint)

    return (
        <Tooltip title={tooltip}>
            <Button
                style={style}
                type={type}
                onClick={onClick}
                size={size} 
                shape={shape} 
                icon={icon}
                htmlType={htmlType}
            >
                {text}
            </Button>
        </Tooltip>
        
    );

    return (
        <Button 
            style={style}
            onClick={onClick}
            size={size}
            shape={shape}
            icon={icon}
            htmlType={htmlType}
            type={type}
        >
            {text}
        </Button>        
    );

}

export default WButton;