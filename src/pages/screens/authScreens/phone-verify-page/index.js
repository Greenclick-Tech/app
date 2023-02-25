import React, { useContext, useState } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Alert } from "react-native";
import styled from 'styled-components';
import { Context } from '../../../../helpers/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestHandler from '../../../../helpers/api/rest_handler';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import CustomButton from '../../../../components/custom-button';
import endpoints from '../../../../constants/endpoints';

const Cont = styled.View`
    flex: 1;
    margin: 100px 20px;
`;

const Subtitle = styled.Text`
    color: #3B414B;
    font-weight: bold;
    font-size: 42px;362985
`;

const Body = styled.Text`
    color: #4aaf6e;
    line-height: 21px;
    font-size: 14px;
    padding-bottom: 40px;
`;

const UnderlineText = styled.Text`
text-decoration: underline;
text-decoration-color: #4aaf6e;
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

const PhoneVerifyPage = ({ navigation, route }) => {

    const CELL_COUNT = 6;
    const { setUser, pushToken } = useContext(Context);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [retryCooldown, setRetryCooldown] = useState();
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    //Phone number from previous page
    const phone = route.params.phone;

    const handleRetry = async () => {
        let res = await RequestHandler(
            "post",
            endpoints.VERIFY(),
            { "phone": phone },
            "application/x-www-form-urlencoded",
        )
        if (res == 'OK') {
            
        } else {
            Alert.alert("An error has occured", res.error.message);
        }
    }

    //Verify User. Request returns accessToken
    const handleVerify = async () => {

        let res;

        if (route.params.signup) {
            res = await RequestHandler(
                "post",
                endpoints.REGISTER(),
                {
                    "phone": phone,
                    "code": value,
                    "push_token": pushToken,
                    "first_name": route.params.firstname,
                    "last_name": route.params.lastname,
                    "email": route.params.email,
                    "address": route.params.address,
                    "date_of_birth": route.params.date_of_birth.toISOString()
                },
                "application/x-www-form-urlencoded"
            );
        } else {
            res = await RequestHandler(
                "post",
                endpoints.LOGIN(),
                {
                    "phone": phone,
                    "code": value,
                    "push_token": pushToken
                },
                "application/x-www-form-urlencoded"
            );
        }

        if ("error" in res) {
            setError(res.error.message)
            if(res.error.message == 'User already exists with that phone number.') {
                Alert.alert(
                    "Issue Signing you Up",
                    "An account already exists with this phone number, please log in instead.",
                    [
                      {
                        text: "No",
                      },
                      { text: "Log In", onPress: () => {
                        navigation.navigate('Start')
                      }
                    }
                    ]
                  );
            }
            
        } else {
            await AsyncStorage.setItem("access_token", res.access_token)
            await AsyncStorage.setItem("refresh_token", res.refresh_token)
            setUser({access_token: res.access_token, refresh_token: res.refresh_token})
        }
    }

    return (
        <Cont>
            <SafeArea
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                <Subtitle>Verify</Subtitle>
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
                <TryAgain onPress={()=> {
                    handleRetry()
                }}><Body>Didn't recieve a text? <UnderlineText>Tap here to retry.</UnderlineText></Body></TryAgain>

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

export default PhoneVerifyPage;