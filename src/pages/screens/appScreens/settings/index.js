import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Context } from '../../../../helpers/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const SettingsMain = ( { navigation }) => {
    const { setUser } = useContext(Context);

    return (
        <SafeAreaView tyle={{ flex: 1, justifyContent: 'space-between', alignItems: 'center',   }}  edges={['top', 'left', 'right']}>
            <FAD>
                <FlatList
                data={[
                    // {
                    //     name: "Account",
                    //     route: "Account-Page",
                    //     icon: "people-outline"
                    // },
                    // {
                    //     name: "Notifications",
                    //     route: "Notifications",
                    //     icon: "notifications-outline"
                    // },
                    // {
                    //     name: "Appearance",
                    //     route: "Appearance",
                    //     icon: "eye-outline"
                    // },
                    // {
                    //     name: "Privacy & Security",
                    //     route: "PrivacySecurity",
                    //     icon: "lock-closed-outline"
                    // },
                    // {
                    //     name: "Help & Support",
                    //     route: "HelpSupport",
                    //     icon: "help-circle-outline"
                    // },
                    {
                        name: "Logout",
                        route: "Logout",
                        icon: "log-out-outline"
                    }
                ]}
                renderItem={(e)=> {
                    console.log(e.item.route)
                    return (
                        <Container>
                            <Touchable onPress={()=> {
                                switch(e.item.route) {
                                    case 'Account-Page':
                                    navigation.push('Account-Page')
                                    break;
                                    case 'Notifications':
                                    navigation.push('Notifications')
                                    break;
                                    case 'Appearance':
                                    navigation.push('Appearance')
                                    break;
                                    case 'PrivacySecurity':
                                    navigation.push('PrivacySecurity')
                                    break;
                                    case 'HelpSupport':
                                    navigation.push('HelpSupport')
                                    break;
                                    case 'Logout':
                                    Alert.alert('You are about to Log Out', 'You must log back in to continue.', [
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                        {text: 'Log Out', onPress: () =>  {
                                            AsyncStorage.removeItem("access_token").then(()=> {
                                                console.log('success')
                                            }).catch(()=> {
                                                console.log("error")
                                                Alert.alert("Error Logging out. There was an error preventing you from logging out, please try again.")
                                            })
                                            setUser()
                                        }},
                                        ]);
                                    break;
                                }
                            }}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Ionicons size={18} name={e.item.icon}></Ionicons>
                                <Text>{e.item.name}</Text>
                                </View>
                                <Ionicons size={18} name={"chevron-forward-outline"} />
                            </Touchable>
                        </Container>
                    )
                }}
                >

                </FlatList>
            </FAD>
        </SafeAreaView>
    )
}

export default SettingsMain