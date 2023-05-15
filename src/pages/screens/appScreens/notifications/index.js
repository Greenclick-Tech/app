import React, { useContext, useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Alert, Image, ActivityIndicator, RefreshControl } from "react-native";
import styled from 'styled-components';
import { Context } from '../../../../helpers/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestHandler from '../../../../helpers/api/rest_handler';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import CustomButton from '../../../../components/custom-button';
import endpoints from '../../../../constants/endpoints';
import { useQuery } from "@tanstack/react-query";
import { useStripeIdentity } from "@stripe/stripe-identity-react-native";

// A square logo for your brand
import logo from '../../../../assets/icon.png';

const Cont = styled.View`
    flex: 1;

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

const SafeArea = styled.ScrollView`
`;

const NotificationContainer = styled.View`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #00000010
    padding: 20px 10px;
`;

const NotificationIcon = styled.Image`
    width: 40px;
    height: 40px;
    border-radius: 100px;
    border: 1px solid #00000015;
`;

const NotificationTextContainer = styled.View`
    flex-shrink: 1;
    padding: 0px 20px;
`;

const NotificationTitle = styled.Text`
    font-size: 16px;
    font-weight: ${props=>props.isUnread ? "600": "400"};
    margin-bottom: 3px;
`;

const NotificationMessage = styled.Text`
    font-size: 14px;
`;

const TitleNotify = styled.Text`
    padding: 20px 15px;
    font-size: 18px;
    font-weight: ${props=>props.isUnread ? "600": "400"};
`;

const CaughtUpText = styled.Text`
    padding: 0px 15px;
    font-size: 14px;
`;

const NotificationsPage = ({ navigation, route }) => {

    const [refreshing, setRefreshing] = useState(false);

    const getNotifications = useQuery({
        queryKey: ["notifications"],
        queryFn: () => fetchNotifications(),
        onSuccess: (data) => {
            console.log(data)
            setTimeout(() => {
                setRefreshing(false)
            }, 500)
        }
    });

    const fetchNotifications = async () => {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_NOTIFICATIONS(),
            undefined,
            undefined,
            true
        )

        if ("error" in res) {
            Alert.alert("An error has occured", res.error.message)
        } else {
            return res;
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getNotifications.refetch()
    }, []);

    return (
        <Cont>
            <SafeArea
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {
                    getNotifications.isLoading ?

                        <ActivityIndicator size={'small'}></ActivityIndicator>

                        :
                        getNotifications.isError ?
                            <EmailText>An error has occured. {getNotifications.data.error.message}</EmailText>
                            :
                            getNotifications.data.notifications.length  == 0 ?
                            <></>
                            :
                            <Cont>
                                <TitleNotify isUnread>Unread</TitleNotify>

                                {
                                    getNotifications.data.notifications.filter((item) => item.unread).length > 0 ?

                                    getNotifications.data.notifications.filter((item) => item.unread).map((item) => {
                                        return <NotificationContainer>
                                        <NotificationIcon
                                            source={{
                                                uri: item.icon_url,
                                            }}
                                        >
        
                                        </NotificationIcon>
                                        <NotificationTextContainer>
                                            <NotificationTitle numberOfLines={1} isUnread>
                                                {item.title}
                                            </NotificationTitle>
                                            <NotificationMessage numberOfLines={2}>
                                                {item.content}
                                            </NotificationMessage>
                                        </NotificationTextContainer>
                                    </NotificationContainer>
                                    })

                                    :
                                    <CaughtUpText>You have no unread notifications.</CaughtUpText>
                                }
                                <TitleNotify>Previous</TitleNotify>
                                {

                                    getNotifications.data.notifications.filter((item) => !item.unread).length > 0 ?

                                    getNotifications.data.notifications.filter((item) => !item.unread).map((item) => {
                                        return <NotificationContainer>
                                        <NotificationIcon
                                            source={{
                                                uri: item.icon_url,
                                            }}
                                        >
        
                                        </NotificationIcon>
                                        <NotificationTextContainer>
                                            <NotificationTitle numberOfLines={1} >
                                                {item.title}
                                            </NotificationTitle>
                                            <NotificationMessage numberOfLines={2}>
                                                {item.content}
                                            </NotificationMessage>
                                        </NotificationTextContainer>
                                    </NotificationContainer>
                                    })

                                    :
                                    <CaughtUpText>You have no read notifications.</CaughtUpText>
                                }
                            </Cont>
                            
                }

            </SafeArea>
        </Cont>
    )
};

export default NotificationsPage;