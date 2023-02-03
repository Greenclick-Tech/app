import React, { useState, useRef } from 'react';
import { KeyboardAvoidingView, TextInput } from "react-native";
import styled from 'styled-components';
import CustomButton from '../../../../components/custom-button';
import RequestHandler from '../../../../helpers/api/rest_handler';
import endpoints from '../../../../constants/endpoints';
import PhoneInput from "react-native-phone-number-input";

const Cont = styled.View`
    flex: 1;
    margin: 100px 20px;
`;

const Logo = styled.Image`
    width: 150px;
    height: 150px;
    margin: 20px;
`;

const Subtitle = styled.Text`
    color: #3B414B;
    font-weight: bold;
    font-size: 42px;
`;

const Body = styled.Text`
    color: #929696;
    line-height: 21px;
    font-size: 14px;
    padding-bottom: 40px;
`;

const RedBody = styled.Text`
    color: #eb5b5b;
    line-height: 21px;
    font-size: 14px;
    padding-top: 20px;

`;

const ButtonContainer = styled.View`
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
`;

const SafeArea = styled.ScrollView``;

const PhonePage = ({ navigation, route }) => {
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const [country, setCountry] = useState("+1");
    const phoneInput = useRef(null);
    const handleRegister = async () => {
        let res = await RequestHandler(
            "post",
            endpoints.VERIFY(),
            { "phone": value },
            "application/x-www-form-urlencoded",
        )
        if (res == 'OK') {
            if (route.params.signup) {
                navigation.navigate('PhoneVerifyPage', {
                    phone: value,
                    firstname: route.params.firstname,
                    lastname: route.params.lastname,
                    email: route.params.email,
                    address: route.params.address,
                    date_of_birth: route.params.date_of_birth,
                    signup: true
                })
            } else {
                navigation.navigate('PhoneVerifyPage', {
                    phone: value
                })
            }
        }
    }

    return (
        <Cont>
            <SafeArea
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                
                <Subtitle>Your Number</Subtitle>
                <ButtonContainer>
                    <KeyboardAvoidingView>

                        <PhoneInput
                            ref={phoneInput}
                            defaultValue={value}

                            defaultCode="US"
                            layout='first'
                            onChangeFormattedText={(text) => {
                                setValue(text);
                            }}
                            containerStyle={{ width: "100%" }}
                            textContainerStyle={{ borderBottomWidth: 3, borderBottomColor: "#4aaf6e", backgroundColor: "#fff", marginLeft: 10 }}
                            textInputProps={{ placeholder: "Phone Number", placeholderTextColor: "#a6acad" }}
                            countryPickerButtonStyle={{ borderBottomWidth: 3, borderBottomColor: "#4aaf6e", backgroundColor: "#fff" }}
                        />

                    </KeyboardAvoidingView>

                </ButtonContainer>
                <Body>When you tap Continue, Greenclick will send you a text notification with a verification code. Message and data rates may apply. The verified phone number can be used to login.</Body>

                {value.length > 0 ?
                    <CustomButton
                        bgcolor={"#4aaf6e"}
                        fcolor={"#fff"}
                        title={"Continue"}
                        onPress={handleRegister}
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
                {valid ?
                    <></>
                    :
                    <RedBody>Invalid phone number, please try again.</RedBody>
                }
            </SafeArea>
        </Cont>
    )
};

export default PhonePage;