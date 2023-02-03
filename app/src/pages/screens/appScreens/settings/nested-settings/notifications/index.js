import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components'

const Container = styled.View`
    width: 100%;
`;

const Title = styled.Text`
    font-size: 24px;

`;

const PageNotifications = () => {

    return (
        <SafeAreaView tyle={{ flex: 1, justifyContent: 'space-between', alignItems: 'center',   }}  edges={['top', 'left', 'right']}>
            <Container>
                <Title>Notifications</Title>
            </Container>
        </SafeAreaView>
    )
}

export default PageNotifications