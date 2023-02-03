import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components/native';
import Center from '../../../../../components/center';
import { AuthContext } from '../../../../authProvider';
import LogoFullWhite from '../../../../../assets/logo-full-white';
import CustomButton from '../../../../../components/custom-button';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Location from 'expo-location';
import LoadingScreen from '../../../../../components/loading';

const Cont = styled.View`
    flex: 1;
    padding: 100px 0px;
`;

const Subtitle = styled.Text`
    color: #3B414B;
    font-weight: bold;
    font-size: 32px;
    margin-bottom: 6px;
    text-align: center;
`;

const Body = styled.Text`
    color: #3B414B;
    line-height: 24px;
    font-size: 16px;
    text-align: center;
    padding: 0px 10px; 
`;

const Underline = styled.Text`
    text-decoration: underline;
    text-decoration-color: #fff;
    text-decoration-style: solid;
`;

const SafeArea = styled.ScrollView``;

const NotificationError = ({ navigation, route }) => {
    const animation = useRef(null);
    return (

        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Cont>
                <Subtitle>
                    Enable Notifications
                </Subtitle>
                <Body>Please enable notification services in your settings. Go to Settings > Greenclick > Notifications.</Body>
                <View style={styles.animationContainer}>

                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 200,
                            height: 200,
                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={{ uri: 'https://assets5.lottiefiles.com/packages/lf20_gjvlmbzr.json' }}
                    />
                </View>

            </Cont>

        </SafeAreaView>

    )
};

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    buttonContainer: {
        paddingTop: 20,
    },
});

NotificationError.defaultProps = {

};

export default NotificationError;