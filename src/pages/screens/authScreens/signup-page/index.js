import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import { View, Text, Alert, Platform } from "react-native";
import styled from "styled-components";
import CustomButton from "../../../../components/custom-button";
import { SafeAreaView } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import * as Location from "expo-location";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Context } from '../../../../helpers/context/context';
import endpoints from "../../../../constants/endpoints";
import RequestHandler from "../../../../helpers/api/rest_handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';

const Subtitle = styled.Text`
  color: #3b414b;
  font-weight: bold;
  font-size: 42px;
  padding-bottom: 10px;
`;

const Body = styled.Text`
  color: #1f2226;
  font-size: 14px;
  padding-bottom: 5px;
`;

const Disclaimer = styled.Text`
  color: #1f222690;
  font-size: 12px;
  padding-bottom: 10px; 
  text-align: center;
`;

const ButtonContainer = styled.View`
  padding: 10px 0px;
  flex: 1;
  padding-left: ${(props) => (props.left ? "5px" : "0px")};
  padding-right: ${(props) => (props.right ? "5px" : "0px")};
`;

const InputMain = styled.TextInput`
    padding: 10px 0px;
    font-size: 18px;
    border-bottom-width: 3px;
    border-bottom-color: #4aaf6e;
`;

const PseudoInput = styled.View`
    padding: 10px 0px;
    border-bottom-width: 3px;
    border-bottom-color: #4aaf6e;
`;

const PseudoTextPlaceholder = styled.Text`
    font-size: 18px;
    color: ${props => props.color ? "#AAA" : "#3b414b"} ;
`;

const ButtonWrapper = styled.View`
  padding: 10px 0px;
  flex: 1;
`;

const InputMainTouch = styled.TouchableOpacity`
    width: 100%;
`;

const InputTitle = styled.Text`
  font-size: 14px;
  color: #aaa;
`;

const FlexContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const ExtraInfo = ({ navigation, route }) => {
  const [email, setEmail] = useState();
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [address, setAddress] = useState();
  const [validateError, setValidateError] = useState()
  const [date_of_birth, setDateOfBirth] = useState(new Date());
  const today = new Date();
  const [show, setShow] = useState(false);
  const { location, setLocation, setLocationStatus, pushToken, setPushToken, setUser, expiryRef, clearExpiry } = useContext(Context);
  const key = Platform.OS === 'ios' ? "AIzaSyBZR2Mae8MxS4Q---MQl87gG1CGTVNZy5w" : "AIzaSyB-PDmtDDoiNi9BcD9Qfb8d5RpX5EficyE"

  const showDatepicker = () => {
    setShow(true)
  };

  const handleConfirm = (date) => {
    setDateOfBirth(date);
    setShow(false);
  }

  const hideDatePicker = () => {
    setShow(false);
  }

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    //obtaining the users location
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLocationStatus(status);
  };

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

  useLayoutEffect(() => {
    getLocation()
  }, [])
  
  const validateUser = async () => {
    let res = await RequestHandler(
      "post",
      endpoints.REGISTER(),
      pushToken ? {
        "first_name": firstname,
        "last_name": lastname,
        "email_address": email,
        "address": address,
        "date_of_birth": date_of_birth.toISOString(),
        "phone_number": route.params.phone,
        "code": route.params.code,
        "push_token": pushToken
      }
        :
        {
          "first_name": firstname,
          "last_name": lastname,
          "email_address": email,
          "address": address,
          "date_of_birth": date_of_birth.toISOString(),
          "phone_number": route.params.phone,
          "code": route.params.code,
        },
      "application/x-www-form-urlencoded"
    )
    if ("error" in res) {
      Alert.alert('An error has occured', res.error.message)
      setValidateError(res.error.message)

    } else {
      clearExpiry()
      Alert.alert("Success", "Your account has successfully been created, welcome to Greenclick.")
      await AsyncStorage.setItem("access_token", res.access_token)
      await AsyncStorage.setItem("refresh_token", res.refresh_token)
      setUser({ access_token: res.access_token, refresh_token: res.refresh_token })
      navigation.navigate('Home')
    }
  }

  const mutation = useMutation({
    mutationFn: validateUser
  })



  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
      }}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%", paddingLeft: 20, paddingRight: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Subtitle>Your Information</Subtitle>
        <Body>
          In order to start your Greenclick car rental experience, we will need
          some information from you.
        </Body>
        <ButtonContainer>
          <InputTitle>Email Address</InputTitle>
          <InputMain
            keyboardType="email-address"
            placeholder={"Email"}
            autoCorrect={false}
            placeholderTextColor="#AAA"
            autoCapitalize={"none"}
            onChangeText={(e) => {
              e.length != 0 ? setEmail(e) : setEmail();
            }}
          ></InputMain>
        </ButtonContainer>
        <FlexContainer>
          <ButtonContainer right>
            <InputTitle>First Name</InputTitle>
            <InputMain
              keyboardType="default"
              placeholder={"First Name"}
              autoCorrect={false}
              placeholderTextColor="#AAA"
              onChangeText={(e) => {
                e.length != 0 ? setFirstName(e) : setFirstName();
              }}
            ></InputMain>
          </ButtonContainer>
          <ButtonContainer left>
            <InputTitle>Last Name</InputTitle>
            <InputMain
              keyboardType="default"
              autoCorrect={false}
              placeholder={"Last Name"}
              placeholderTextColor="#AAA"
              onChangeText={(e) => {
                e.length != 0 ? setLastName(e) : setLastName();
              }}
            ></InputMain>
          </ButtonContainer>
        </FlexContainer>

        <ButtonContainer>
          <InputTitle>Address</InputTitle>
          <GooglePlacesAutocomplete
            enablePoweredByContainer={false}
            fetchDetails={true}
            placeholder={"Address"}
            styles={{
              container: {
                flex: 1,
              },
              textInputContainer: {
                flexDirection: "row",
              },
              textInput: {
                backgroundColor: "#f7f7f7",
                height: 44,
                borderRadius: 5,
                paddingVertical: 5,
                paddingHorizontal: 0,
                fontSize: 18,
                flex: 1,
                borderBottomColor: "#4aaf6e",
                borderBottomWidth: 3,
              },
              poweredContainer: {
                justifyContent: "flex-end",
                alignItems: "center",
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
                borderColor: "#c8c7cc",
                borderTopWidth: 0.5,
              },
              powered: {},
              listView: {},
              row: {
                padding: 13,
                height: 44,
                flexDirection: "row",
              },
              separator: {
                height: 0.5,
                backgroundColor: "#e1e5eb",
              },
              description: {},
              loader: {
                flexDirection: "row",
                justifyContent: "flex-end",
                height: 20,
              },
            }}
            onPress={(data) => {
              // 'details' is provided when fetchDetails = true
              setAddress(data.description);
            }}
            textInputProps={{
              onChangeText: (text) => {
                text.length == 0 ? setAddress() : null;
              }
            }}
            query={{
              key: key,
              language: "en",
              location: `${!!location && location.coords.latitude}, ${!!location && location.coords.longitude}`,
              radius: "10000000000",
              strictbounds: true,
              locationBias: 'ipbias',
              type: 'address',
              rankby: 'distance',
              components: 'country:us|country:ca'
            
            }}
            debounce={200}
            //Hidden Request URL
          />
        </ButtonContainer>
        <ButtonContainer>
          <InputMainTouch onPress={showDatepicker}>
            <InputTitle>Date of Birth</InputTitle>
            <View>
              <PseudoInput>
                <PseudoTextPlaceholder color={date_of_birth.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)}>{moment(date_of_birth).format('ll')}</PseudoTextPlaceholder>
              </PseudoInput>
            </View>
          </InputMainTouch>
        </ButtonContainer>

        <ButtonWrapper>
          {email && firstname && lastname && address && date_of_birth && date_of_birth.setHours(0, 0, 0, 0) != today.setHours(0, 0, 0, 0) ? (
            <CustomButton
              bgcolor={"#4aaf6e"}
              fcolor={"#fff"}
              title={"Signup"}
              onPress={()=> mutation.mutate()}
            ></CustomButton>
          ) : (
            <CustomButton
              bgcolor={"#4aaf6e66"}
              fcolor={"#fff"}
              title={"Signup"}
              opacity={40}
            ></CustomButton>
          )}
        </ButtonWrapper>
        <Disclaimer>When you tap Signup, you agree to our terms and conditions & privacy policy. </Disclaimer>
        <Text style={{ color: "#FF0000" }}>{validateError}</Text>

        <DateTimePickerModal
          isVisible={show}
          mode="date"
          onConfirm={(date) => handleConfirm(date)}
          onCancel={hideDatePicker}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ExtraInfo;
