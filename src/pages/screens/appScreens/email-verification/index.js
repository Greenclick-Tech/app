import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Alert } from "react-native";
import styled from 'styled-components';
import { Context } from '../../../../helpers/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestHandler from '../../../../helpers/api/rest_handler';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import CustomButton from '../../../../components/custom-button';
import endpoints from '../../../../constants/endpoints';
import { useQuery } from "@tanstack/react-query";

const Cont = styled.View`
    flex: 1;
    margin: 100px 20px;
`;

const Subtitle = styled.Text`
    color: #3B414B;
    font-weight: bold;
    font-size: 32px;
    margin-bottom: 5px;
`;

const EmailText = styled.Text`
    color: #3B414B;
    font-size: 14px;
    line-height: 20px;
`;

const Bolding = styled.Text`
    font-weight: 600;
`;

const Body = styled.Text`
    color: ${props => props.color && props.color};
    line-height: 21px;
    font-size: 14px;
    padding-bottom: 40px;
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
    padding-top: 20px;
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

const EmailVerifyPage = ({ navigation, route }) => {

    const CELL_COUNT = 6;
    const { setUser, pushToken, setPushToken, expiryRef, debounceExpiry, clearExpiry } = useContext(Context);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [timeout, setTime] = useState(0);
    const [expiry, setExpiry] = useState(0);
    const [retryCooldown, setRetryCooldown] = useState();
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const [notification, setNotification] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState()


    //Phone number from previous page

    const handleRetry = async () => {
        setTime(30)
        let res = await RequestHandler(
            "post",
            endpoints.VERIFY(),
            { "email_address": route.params.email },
            "application/x-www-form-urlencoded",
            true
        )
        if ("error" in res) {
            Alert.alert("An error has occured", res.error.message);
        } else {
            setExpiry(res.expires_in)
            Alert.alert("Verifcation Code Sent", `A new 6 digit verification code was sent to ${route.params.email}.`)
        }
    }

    const handleVerify = async () => {
        let res;
        res = await RequestHandler(
            "post",
            endpoints.VERIFY_EMAIL(),
            {
                "email_address": route.params.email,
                "code": value
            },
            "application/x-www-form-urlencoded",
            true
        );

        if(res == 'OK') {
            clearExpiry()
            Alert.alert("Your Email has Successfully been Verified.", "You are now able to access all of Greenclick's features")
            navigation.navigate({
                name: route.params.origin,
                params: route.params,
            })
        } else {
            setError(res.error.message)
        }
    }

    //Decrement Counter
    useEffect(() => {
        const timer =
            timeout > 0 && setInterval(() => setTime(timeout - 1), 1000);
        return () => clearInterval(timer);
    }, [timeout]);

    //Set Original Expiry
    useEffect(() => {
        setExpiry(route.params.expires_in)
    }, [route.params.expires_in])

    //Redirect if mounted/expired code
    useEffect(() => {
        if (expiry > 0) {
            debounceExpiry(expiry, "Home")
        }
    }, [expiry])


    return (
        <Cont>
            <SafeArea
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                <Subtitle>Verify your Email</Subtitle>
                <EmailText>Enter the 6 digit verification code sent to <Bolding>{route.params.email}</Bolding></EmailText>
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
                        onPress={handleVerify}
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
                {error == ""
                    ? <></>
                    : <RedBody>{error}</RedBody>
                }
            </SafeArea>
        </Cont>
    )
};

export default EmailVerifyPage;