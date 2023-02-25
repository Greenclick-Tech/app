import React, {useEffect, useContext, useState} from 'react';
import styled from 'styled-components';
import LogoFullWhite from '../../../../assets/logo-full-white'
import CustomButton from '../../../../components/custom-button';
import { Context } from '../../../../helpers/context/context';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

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

    const { setPushToken } = useContext(Context);
    const [notification, setNotification] = useState(false);

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }
    
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
    
        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setPushToken(token));
    
        // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        //   setNotification(notification);
        // });
    
        // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        //   //console.log(response);
        // });
    
        // return () => {
        //   Notifications.removeNotificationSubscription(notificationListener.current);
        //   Notifications.removeNotificationSubscription(responseListener.current);
        // };
      }, []);

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