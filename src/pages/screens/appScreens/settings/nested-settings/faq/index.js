import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components'
import { Text } from 'react-native';

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
    font-size: 18px;
    margin-bottom: 7px;
    font-weight: 600;
`;

const TitleBody = styled.Text`
    font-size: 14px;
    margin-bottom: 12px;
`;

const Bold = styled.Text`
    font-weight: 500;
`;

const Faq = () => {

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30   }}  edges={['top', 'left', 'right']}>
            <Container>
                <Title>Frequently Asked Questions</Title>
                <TextTitle>Introduction</TextTitle>
                <TitleBody>Coming Soon</TitleBody>
            </Container>
        </SafeAreaView>
    )
}

export default Faq