import React from 'react'
import styled from 'styled-components';

const ButtonWrapper = styled.TouchableOpacity`
    background-color: ${props=>props.bgcolor ? props.bgcolor : "#fff"};
    align-items: center;
    padding: 16px;
    border-radius: ${props=>props.rad ? "5px" : "200px"};
    width: ${props=>props.width ? props.width : "auto"}
`;

const TextCode = styled.Text`
    color: ${props=>props.fcolor ? props.fcolor : "#4aaf6e"};
    font-weight: 600;
    font-size: 18px;
`;

const CustomButton = ({title, rad, onPress, bgcolor, fcolor, width, children}) => {
    return (
        <ButtonWrapper
        onPress={onPress}
        bgcolor={bgcolor}
        width={width}
        rad={rad}
        >
            <TextCode
            fcolor={fcolor}
            >
                {title}
                {children}
            </TextCode>
        </ButtonWrapper>
    )
}

CustomButton.defaultProps = {
    title: "Hello world"
}

export default CustomButton