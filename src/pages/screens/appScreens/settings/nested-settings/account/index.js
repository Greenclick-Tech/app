import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components'
import { Text } from 'react-native';

const Container = styled.View`
    width: 100%;
    padding: 15px;
`;

const Title = styled.Text`
    font-size: 24px;
    margin-bottom: 10px;

`;

const SubTitle = styled.Text`
    font-size: 20px;
    
`;

const PageAccount = () => {

    return (
        <SafeAreaView tyle={{ flex: 1, justifyContent: 'space-between', alignItems: 'center',   }}  edges={['top', 'left', 'right']}>
            <Container>
                <Title>Account</Title>
                <Text>To make changes to your account settings, please contact us at support@greenclick.com</Text>
            </Container>
        </SafeAreaView>
    )
}

export default PageAccount