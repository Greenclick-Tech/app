import React, { useContext, useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Alert, Image, ActivityIndicator } from "react-native";
import styled from 'styled-components';
import { Context } from '../../../../helpers/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestHandler from '../../../../helpers/api/rest_handler';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import CustomButton from '../../../../components/custom-button';
import endpoints from '../../../../constants/endpoints';
import { useQuery } from "@tanstack/react-query";
import { useStripeIdentity } from "@stripe/stripe-identity-react-native";
import moment from 'moment';

// A square logo for your brand
import logo from '../../../../assets/icon.png';

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

const UserVerifyPage = ({ navigation, route }) => {

    const fetchVerificationSessionParams = async () => {
        const data = await RequestHandler(
            "post",
            endpoints.VERIFY_USER(),
            undefined,
            undefined,
            true
        )
        return data;
    };

    const fetchOptions = async () => {
        const response = await fetchVerificationSessionParams();
        return {
            sessionId: response.session_id,
            ephemeralKeySecret: response.ek_secret,
            brandLogo: Image.resolveAssetSource(logo),
        };
    };

    const { status, present, loading } = useStripeIdentity(fetchOptions);

    const handlePress = useCallback(() => {
        present();
    }, [present]);

    const getUser = useQuery({
        queryKey: ["user"],
        queryFn: () => fetchUser(),
        refetchOnWindowFocus: 'always',
        refetchInterval: 8000
    });

    async function fetchUser() {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_CURRENT_USER(),
            undefined,
            undefined,
            true
        );

        if ("error" in res) {
            Alert.alert('An error has occured', res.error.message)
        } else {
            return res;
        }
    }

    return (
        getUser.data.user.identity_verified ?
            <Cont>
                <SafeArea
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={false}
                >
                    <Subtitle>Your have been Verified!</Subtitle>
                    <EmailText>Continue your order by clicking "Continue" below.</EmailText>
                    <ButtonContainer>
                    </ButtonContainer>
                    <CustomButton
                        bgcolor={"#4aaf6e"}
                        fcolor={"#fff"}
                        title={"Continue"}
                        onPress={()=> {
                            navigation.navigate('Confirm', {
                                hotelId: route.params.hotelId,
                                vehicleId: route.params.vehicleId,
                                startDate: moment(route.params.startDate).toDate(),
                                endDate: moment(route.params.endDate).toDate()
                            })
                        }}
                    >
                    </CustomButton>

                </SafeArea>
            </Cont>
            :
            <Cont>
                {

                    status == "FlowCompleted" ?
                        <SafeArea
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps='handled'
                            scrollEnabled={false}
                        >
                            <Subtitle>Your Verification is Processing</Subtitle>
                            <EmailText>Your verification is currently processing. This process usually takes 1-3 minutes and we will notify you when it's done.</EmailText>
                            <ButtonContainer>

                            </ButtonContainer>

                        </SafeArea>
                        :
                        <SafeArea
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps='handled'
                            scrollEnabled={false}
                        >
                            <Subtitle>Verify your ID</Subtitle>
                            <EmailText>To increase trust and safety, Greenclick requires to verify your identification before rental purchases. Have your identification ready and tap "Verify" to start the verification process.</EmailText>
                            <ButtonContainer>

                            </ButtonContainer>
                            {
                                loading ?
                                    <ActivityIndicator size={'small'}></ActivityIndicator>
                                    :
                                    <CustomButton
                                        bgcolor={"#4aaf6e"}
                                        fcolor={"#fff"}
                                        title={"Verify"}
                                        onPress={handlePress}
                                    >
                                    </CustomButton>
                            }
                            {
                                status == "FlowFailed" &&
                                <RedBody>Verification was cancelled by user. If this was a mistake, please tap Verify again.</RedBody>
                            }

                        </SafeArea>
                }
            </Cont>
    )
};

export default UserVerifyPage;