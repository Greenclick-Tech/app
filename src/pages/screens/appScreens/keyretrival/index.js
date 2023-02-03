import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import styled from "styled-components";
import { SafeAreaView } from "react-native";
import CustomButton from "../../../../components/custom-button";
import { useQuery } from "@tanstack/react-query";
import { Context } from "../../../../helpers/context/context";
import RequestHandler from "../../../../helpers/api/rest_handler";
import endpoints from "../../../../constants/endpoints";

const Background = styled.View`
    width: 100%;
    flex: 1;
    background-color: #4aaf6d;
    padding: 30px 15px
    align-items: center;
`;

const Title = styled.Text`
  font-size: 28px;
  text-align: center;
  color: #fff;
  font-weight: 600;
  padding-bottom: 10px;
`;

const Subtitle = styled.Text`
  font-size: 15px;
  text-align: center;
  color: #fff;
  padding-bottom: 30px;
`;

const Image = styled.Image`
  max-width: 250px;
  max-height: 250px;
  resize-mode: contain;
  flex: 1;
  margin-bottom: 30px;
`;

const KeyRetrival = ({ route, navigation }) => {
  const { user, location } = useContext(Context);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");

  const locationSuccess = () => {
    Alert.alert(
      "Success",
      "Your location is valid. To open the box, you must follow the next step."
    );
    setPage(1);
  };

  const boxUnlocking = () => {
    unlockBox.refetch();
  };

  async function checkNearbyBox() {
    let res = await RequestHandler(
      "GET",
      endpoints.CHECK_BOX_PROXIMITY(
        route.params.hotel_id,
        location.coords.latitude,
        location.coords.longitude
      ),
      undefined,
      undefined,
      true
    );
    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, hotel prob doesnt exist or somthing
      //
      setError(res);
    } else {
      return res;
    }
  }

  async function funcUnlockBox() {
    let res = await RequestHandler(
      "GET",
      endpoints.UNLOCK_VEHICLE_LATCH(
        route.params.hotel_id,
        route.params.vehicle_id
      ),
      undefined,
      undefined,
      true
    );

    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, hotel/vehicle prob doesnt exist or somthing,
      // OR the hotel doesnt even have a box yet
      // or u could receive 403, so show the error message to user
      //
      return res;
    } else {
      // res.latch_id = Number
      // tell the user t expect their keys in "Latch #X"
      return res;
    }
  }

  const nearbyBox = useQuery({
    queryKey: ["nearbyBox"],
    queryFn: () => checkNearbyBox(),
    enabled: false,
    retry: false,
    cacheTime: 0,
  });

  const unlockBox = useQuery({
    queryKey: ["unlockBox"],
    queryFn: () => funcUnlockBox(),
    enabled: false,
    cacheTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: (data)=> "error" in data ? Alert.alert("An Error has Occured", data.error.message) : setPage(2)
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {page == 0 ? (
        <Background>
          <Title>Please Stand Near the Greenclick Valet Box</Title>
          <Subtitle>
            In order to open the greenclick box, you must be in a 5 meter radius
            of the greenclick valet box.
          </Subtitle>

          <Image source={require("../../../../assets/boxrad.png")}></Image>
          <CustomButton
            title={"I am Nearby the Box"}
            bgcolor={"#FFF"}
            fcolor={"#4aaf6e"}
            width={"100%"}
            onPress={() => {
              nearbyBox.refetch();
            }}
          ></CustomButton>
          {nearbyBox.isFetching ? (
            <View
              style={{
                paddingTop: 15,
              }}
            >
              <ActivityIndicator
                color={"#fff"}
                size={"small"}
              ></ActivityIndicator>
            </View>
          ) : nearbyBox.isFetched ? (
            nearbyBox.isError ? (
              Alert.alert("An Error has Occured", error && error.error.message)
            ) : (
              locationSuccess()
            )
          ) : (
            <></>
          )}
        </Background>
      ) : page == 1 ? (
        <Background>
          <Title>Tap to Open the Greenclick Valet Box</Title>
          <Subtitle>
            You're successfully in radius of the greenclick box. You can now
            access the keys to your car rental by tapping below.
          </Subtitle>
          <CustomButton
            title={"Open Box"}
            bgcolor={"#FFF"}
            fcolor={"#4aaf6e"}
            width={"100%"}
            onPress={() => {
              Alert.alert(
                "You are Now Opening the Greenclick Box",
                "Please make sure to close the latch when you have recieved your keys.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Open Now",
                    style: "default",
                    onPress: () => unlockBox.refetch(),
                  },
                ]
              );
            }}
          ></CustomButton>
        </Background>
      ) : (
        <Background>
            <Title>Enjoy your Rental!</Title>
            <Subtitle>
            To avoid late fees, please make sure to return your vehicle before the due date. As well, please make sure the greenclick box latch is closed.
          </Subtitle>
          <CustomButton
            title={"Return to Home"}
            bgcolor={"#FFF"}
            fcolor={"#4aaf6e"}
            width={"100%"}
            onPress={() => {
              navigation.navigate('Home')
            }}
          ></CustomButton>
        </Background>
      )}
    </SafeAreaView>
  );
};

export default KeyRetrival;
