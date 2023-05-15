import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components'
import { ActivityIndicator, Alert, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import endpoints from "../../../../../../constants/endpoints";
import RequestHandler from "../../../../../../helpers/api/rest_handler";
import moment from "moment";

const Container = styled.ScrollView`
    width: 100%;
    padding: 15px;
    padding-top: 40px
`;

const Title = styled.Text`
    font-size: 24px;
    margin-bottom: 10px;

`;

const SubTitle = styled.Text`
    font-size: 20px;
    
`;

const InputTitle = styled.Text`
    padding-bottom: 5px;
    font-size: 16px;
`;
const TextInputDisabled = styled.TextInput`
    padding: 15px 15px;
    border: 1px solid #00000020;
    border-radius: 10px;
    background-color: #eeeeee;
    margin-bottom: 15px;
`;

const PageAccount = () => {

    const getUser = useQuery({
        queryKey: ["user"],
        queryFn: () => fetchUser(),
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
        console.log(res)
          return res;
        }
      }

    return (
            getUser.isLoading ?
            <ActivityIndicator size={'small'}></ActivityIndicator>
            :
            getUser.isError ?
            <Text>An error has occured.</Text>
            :
            <Container>
                <Title>Account Settings</Title>
                <Text style={{paddingBottom: 20}}>To make changes to your account settings, please contact us at https://help.greenclick.app/</Text>

                <InputTitle>First Name</InputTitle>
                <TextInputDisabled editable={false} value={getUser.data.user.first_name}>
                </TextInputDisabled>

                <InputTitle>Last Name</InputTitle>
                <TextInputDisabled editable={false} value={getUser.data.user.last_name}>
                </TextInputDisabled>

                <InputTitle>Date of Birth</InputTitle>
                <TextInputDisabled editable={false} value={moment(getUser.data.user.date_of_birth).format("LL")}>
                </TextInputDisabled>

                <InputTitle>Address</InputTitle>
                <TextInputDisabled editable={false} value={getUser.data.user.address}>
                </TextInputDisabled>

                <InputTitle>Email Address</InputTitle>
                <TextInputDisabled editable={false} value={getUser.data.user.email_address}>
                </TextInputDisabled>

                <InputTitle>Phone Number</InputTitle>
                <TextInputDisabled editable={false} value={getUser.data.user.phone_number}></TextInputDisabled>
                
            </Container>
    )
}

export default PageAccount