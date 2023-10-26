import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Alert } from "react-native";
import styled from 'styled-components';
import { Context } from '../../../../helpers/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestHandler from '../../../../helpers/api/rest_handler';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import CustomButton from '../../../../components/custom-button';
import endpoints from '../../../../constants/endpoints';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useMutation } from '@tanstack/react-query';

const Cont = styled.View`
    flex: 1;
    margin: 100px 20px;
`;

const Subtitle = styled.Text`
    color: #3B414B;
    font-weight: bold;
    font-size: 42px;
    padding-bottom: 10px;
`;

const Body = styled.Text`
    color: ${props => props.color && props.color};
    line-height: 21px;
    font-size: 14px;
    padding-bottom: 40px;
`;

const PhoneNumber = styled.Text`
    color: #000000B6;
    line-height: 21px;
    font-size: 14px;
`;

const UnderlineText = styled.Text`
    text-decoration: underline;
    text-decoration-color: ${props => props.color && props.color};
    text-decoration-style: solid;
`;

const RedBody = styled.Text`
    color: #eb5b5b;
    line-height: 21px;
    font-size: 14px;
    padding-top: 20px;

`;

const TryAgain = styled.TouchableOpacity``;

const ButtonContainer = styled.View`
    width: 100%;
    padding-bottom: 20px;
`;

const SafeArea = styled.ScrollView``;

const styles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#4aaf6e',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
});

const PhoneVerifyPage = ({ navigation, route }) => {

    //Phone number from previous page
    const phone = route.params.phone;
    const CELL_COUNT = 6;
    const { user, setUser, pushToken, setPushToken, expiryRef, debounceExpiry, clearExpiry } = useContext(Context);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [timeout, setTime] = useState(0);
    const [expiry, setExpiry] = useState(0);
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

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
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {

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
        if (!pushToken) {
            registerForPushNotificationsAsync().then(token => {
                setPushToken(token)
            });
        }

    }, [])

    //Decrement Counter
    useEffect(() => {
        const timer =
            timeout > 0 && setInterval(() => setTime(timeout - 1), 1000);
        return () => clearInterval(timer);
    }, [timeout]);

    //Set Original Expiry
    useEffect(() => {
        if(route.params.expires_in) {
            setExpiry(route.params.expires_in)
        }
    }, [route.params.expires_in])

    //Expiry Cleanup

    //Redirect if mounted/expired code
    useEffect(() => {
        if (expiry > 0) {
            clearInterval(expiryRef.current)
            debounceExpiry(expiry, 'Phone')
        }
    }, [expiry])


    const handleRetry = async () => {
        setTime(30)
        clear
        let res = await RequestHandler(
            "post",
            endpoints.VERIFY(),
            { "phone_number": phone },
            "application/x-www-form-urlencoded",
        )
        if ("error" in res) {
            Alert.alert("An error has occured", res.error.message);
            
        } else {
            setExpiry(res.expires_in)
            Alert.alert("A new code was sent.", `A new 6 digit verification code was sent to ${phone}`);
        }
    }

    //Verify User. Request returns accessToken
    const handleVerify = async () => {
        let res;
        res = await RequestHandler(
            "post",
            endpoints.LOGIN(),
            !pushToken ? {
                "phone_number": phone,
                "code": value
            } :
                {
                    "phone_number": phone,
                    "code": value,
                    "push_token": pushToken
                },
            "application/x-www-form-urlencoded"
        );

        if ("error" in res) {
            setError(res.error.message)
            if (res.error.status == 404) {
                setError('')
                navigation.navigate('Signup', {
                    phone: phone,
                    code: value
                })
            } else {
                Alert.alert("An error has occured", res.error.message);
            }

        } else {
            clearExpiry()
            await AsyncStorage.setItem("access_token", res.access_token)
            await AsyncStorage.setItem("refresh_token", res.refresh_token)
            setUser({ access_token: res.access_token, refresh_token: res.refresh_token })
            navigation.navigate('Home')
        }
    }

    const mutationVerify = useMutation({
        mutationFn: handleVerify
      })

    return (
        <Cont>
            <SafeArea
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                <Subtitle>Verify</Subtitle>
                <PhoneNumber>Enter the 6 digit verification code sent to {phone}</PhoneNumber>
                <ButtonContainer>
                    <KeyboardAvoidingView>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={setValue}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            )}
                        />
                    </KeyboardAvoidingView>

                </ButtonContainer>
             
                <TryAgain onPress={() => {
                    !(timeout > 0) && handleRetry();
                }}>
                    <Body color={timeout > 0 ? "#85979e" : "#4aaf6e"}> {timeout > 0 ? "A new code was sent. Retry again in" : "Didn't recieve a text?"} <UnderlineText color={timeout > 0 ? "#85979e" : "#4aaf6e"}>{timeout > 0 ? `${timeout} seconds` : "Tap here to retry."}</UnderlineText></Body></TryAgain>

                {value.length === 6 ?
                    <CustomButton
                        bgcolor={"#4aaf6e"}
                        fcolor={"#fff"}
                        title={"Continue"}
                        onPress={()=> mutationVerify.mutate()}
                    >
                    </CustomButton>
                    :
                    <CustomButton
                        bgcolor={"#4aaf6e66"}
                        fcolor={"#fff"}
                        title={"Continue"}
                        opacity={40}
                    >
                    </CustomButton>
                }
                {
                    error == "" && (<RedBody>{error}</RedBody>)
                }
            </SafeArea>
        </Cont>
    )
};

export default PhoneVerifyPage;