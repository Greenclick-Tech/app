import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Context } from '../../../../helpers/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestHandler from '../../../../helpers/api/rest_handler';
import endpoints from '../../../../constants/endpoints';

const FAD = styled.View`
    width: 100%;
    height: 100%;
`;

const Container = styled.View`
    padding-left: 30px;
    padding-right: 30px;
`;

const Touchable = styled.TouchableOpacity`
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    flex-direction: row;
    align-items: center;
    border-bottom-color: #00000015;
    border-bottom-width: 1px;
    justify-content: space-between;
`;

const Text = styled.Text`
    font-size: 16px;
    color: #000
    font-weight: 400;
    padding-left: 18px;
`;

const SettingsMain = ({ navigation }) => {
    const { setUser } = useContext(Context);

    const DeleteAccount = async () => {
        let res = await RequestHandler(
            "DELETE",
            endpoints.DELETE(),
            undefined,
            undefined,
            true
        );
        if (res == 'OK') {
            AsyncStorage.multiRemove(["access_token", "refresh_token"]).catch((err) => Alert.alert("Error Logging out. There was an error preventing you from logging out, please try again."))
            setUser()

        } else {
            Alert.alert('Error deleting your account', 'Please contact support@greenclicktechnologies.com for assistance in deleting your account', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                { text: 'Ok' },
            ]);
        }
    }

    return (
        <SafeAreaView tyle={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', }} edges={['top', 'left', 'right']}>
            <FAD>
                
                <Container>

                    <Touchable onPress={() => {
                        navigation.navigate('Account-Page')
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons size={18} name={"people-outline"}></Ionicons>
                            <Text>Account</Text>
                        </View>
                        <Ionicons size={18} name={"chevron-forward-outline"} />
                    </Touchable>

                    <Touchable onPress={() => {
                        navigation.navigate('PrivacySecurity')
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons size={18} name={"lock-closed-outline"}></Ionicons>
                            <Text>Privacy & Security</Text>
                        </View>
                        <Ionicons size={18} name={"chevron-forward-outline"} />
                    </Touchable>

                    <Touchable onPress={() => {
                        navigation.navigate('Support')
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons size={18} name={"information-circle-outline"}></Ionicons>
                            <Text>Support</Text>
                        </View>
                        <Ionicons size={18} name={"chevron-forward-outline"} />
                    </Touchable>

                    <Touchable onPress={() => {
                        navigation.navigate('Faq')
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons size={18} name={"help-circle-outline"}></Ionicons>
                            <Text>Frequently Asked Questions</Text>
                        </View>
                        <Ionicons size={18} name={"chevron-forward-outline"} />
                    </Touchable>

                    <Touchable onPress={() => {
                        Alert.alert('You are about to Log Out', 'You must log back in to continue.', [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Log Out', onPress: () => {

                                    AsyncStorage.multiRemove(["access_token", "refresh_token"]).catch((err) => Alert.alert("Error Logging out. There was an error preventing you from logging out, please try again."))

                                    setUser()
                                }
                            },
                        ]);
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons size={18} name={"log-out-outline"}></Ionicons>
                            <Text>Logout</Text>
                        </View>
                        <Ionicons size={18} name={"chevron-forward-outline"} />
                    </Touchable>

                    <Touchable onPress={() => {
                        Alert.alert('You are about to Delete your Account', 'Deleting your account will remove all of your account data from our servers. You will have to sign up to use the greenclick app again. Are you sure you want to continue?', [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {text: 'Delete Account', onPress: () =>  {
                                DeleteAccount()
                            }},
                        ]);
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons color={"#FF0000"} size={18} name={"alert-circle-outline"}></Ionicons>
                            <Text style={{color: "#FF0000"}}>Delete Account</Text>
                        </View>
                        <Ionicons color={"#FF0000"} size={18} name={"chevron-forward-outline"} />
                    </Touchable>
                </Container>
            </FAD>
        </SafeAreaView>
    )
}

export default SettingsMain