import React, { useContext, useEffect, useState } from 'react';
import { Linking, View, Platform } from 'react-native'
import styled from 'styled-components';
import LogoFullWhite from '../../../../assets/logo-full-white'
import CustomButton from '../../../../components/custom-button';
import { Context } from '../../../../helpers/context/context';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from 'expo-constants';

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

const Title = styled.Text`
    font-size: 26px;
    font-weight: 500;
    color: #fff;
    text-align: center; 
    margin-bottom: 10px;
`;

const Body = styled.Text`
    color: #fff;
    font-size: 18px;
    text-align: center;
    margin-bottom: 15px;
`;

const ImageNotification = styled.Image`
    width: 360px;
    height: 73px;
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

async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
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
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token.data;
  }

const NotificationsPanel = ({ navigation, existingNotificationPermissions }) => {

    const { pushToken, setPushToken } = useContext(Context);
    const [notification, setNotification] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState("")

    const enableNotifications = () => {
        registerForPushNotificationsAsync().then(token => setPushToken(token));
    }

    return (
        <Container>
            <SafeArea
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                { pushToken ?
                    <Center>
                        <FullPage>
                            <Title>Notifications Enabled</Title>
                            <Body>Notifications are enabled! You can adjust your notification settings in the greenclick app anytime.</Body>
                        </FullPage>
                        <ButtonContainer>
                            <CustomButton
                                title={"Continue"}
                                color={'#ffffff'}
                                onPress={() => {
                                    navigation.navigate("Start")
                                }}
                            >
                            </CustomButton>
                        </ButtonContainer>
                    </Center>
                    :
                    <Center>
                        <FullPage>
                            <Title>Enable Notifications</Title>
                            <Body>Notifications are important in your Greenclick Car Rental experience. Please enable them below.</Body>
                            <ImageNotification style={{
                            }} source={require("../../../../assets/notifications.png")}></ImageNotification>
                        </FullPage>
                        <ButtonContainer>
                            <CustomButton
                                title={"Enable Notifications"}
                                color={'#ffffff'}
                                onPress={() => {
                                    enableNotifications()
                                }}
                            >
                            </CustomButton>
                            <LoginButton
                                onPress={() => {
                                    navigation.navigate('Start')
                                }}
                            >
                                <TextLogin>Enable Notifications Later</TextLogin>
                            </LoginButton>
                        </ButtonContainer>
                    </Center>
                }
            </SafeArea>
        </Container>
    )
};

export default NotificationsPanel;