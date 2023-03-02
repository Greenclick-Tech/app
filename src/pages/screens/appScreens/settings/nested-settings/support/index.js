import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components'
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text, Linking } from 'react-native';

const Container = styled.ScrollView`
    width: 100%;
    flex: 1;
    padding-left: 15px;
    padding-right: 15px;
`;

const Title = styled.Text`
    font-size: 24px;
    margin-bottom: 10px;
    font-weight: 600;
`;

const TextTitle = styled.Text`
    font-size: 16px;
    margin-bottom: 7px;
    font-weight: 600;
`;

const TitleBody = styled.Text`
    font-size: 14px;
    margin-bottom: 12px;
`;

const Span = styled.Text`
    font-size: 14px;
    margin-left: 10px;
    color: #038cfc
`;

const Bold = styled.Text`
    font-weight: 500;
`;

const FlexContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
`;


const Support = () => {

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30   }}  edges={['top', 'left', 'right']}>
            <Container>
                <Title>Support</Title>
                <TitleBody>Greenclick is commited to provide state of the art support services to our customers.</TitleBody>
                <TextTitle>Assistance Line</TextTitle>
                <FlexContainer onPress={()=> {
                    Linking.openURL(`tel:2198040780`)
                }}>
                    <Ionicons name='call-outline' size={24}></Ionicons>
                    <Span>{`(219) 804-0780`}</Span>
                </FlexContainer>
                <TextTitle>Help Desk</TextTitle>
                <FlexContainer onPress={()=> {
                    Linking.openURL(`https://support.greenclick.app`)
                }}>
                    <Ionicons name='chatbubble-ellipses-outline' size={24}></Ionicons>
                    <Span>{`https://support.greenclick.app`}</Span>
                </FlexContainer>
            </Container>
        </SafeAreaView>
    )
}

export default Support