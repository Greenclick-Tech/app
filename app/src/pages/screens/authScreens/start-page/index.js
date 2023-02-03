import React from 'react';
import styled from 'styled-components';
import LogoFullWhite from '../../../../assets/logo-full-white'
import CustomButton from '../../../../components/custom-button';

const Container = styled.View`
    flex: 1;
    background-color: #4aaf6e;
`;

const Center = styled.View`
    justify-content: center;
    flex: 1;
    margin: 0px 20px;
    align-items: center;
`;

const Body = styled.Text`
    color: #fff;
    font-size: 12px;
    text-align: center; 
`;

const ButtonContainer = styled.View`
    flex: 1;
    width: 100%;
`;

const FullPage = styled.View`
    flex: 3;
    justify-content: center;
`;

const Underline = styled.Text`
    text-decoration: underline;
    text-decoration-color: #fff;
    text-decoration-style: solid;
`;

const LoginButton = styled.TouchableOpacity`
    width: 100%;
    align-items: center;
    padding: 15px;
`;

const TextLogin = styled.Text`
    font-size: 16px;
    color: #ffffff;
`;

const SafeArea = styled.ScrollView``;

const StartPage = ({ navigation }) => {
    return (
        <Container>
            <SafeArea
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                <Center>
                    <FullPage>
                        <LogoFullWhite></LogoFullWhite>
                    </FullPage>
                    <ButtonContainer>
                        <CustomButton
                            title={"Get Started"}
                            color={'#ffffff'}
                            onPress={() => {
                                navigation.navigate('Signup', {
                                    signup: true
                                })
                            }}
                        >
                        </CustomButton>
                        <LoginButton
                            onPress={() => {
                                navigation.navigate('Phone', {
                                    signup: false
                                })
                            }}
                        >
                            <TextLogin>Or Login</TextLogin>
                        </LoginButton>
                        <Body>By clicking Get Started, you agree with our <Underline>Terms</Underline> and <Underline>Privacy Policy</Underline>.</Body>
                    </ButtonContainer>
                </Center>
            </SafeArea>
        </Container>
    )
};

export default StartPage;