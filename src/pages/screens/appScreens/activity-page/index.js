import React, { useState, useContext, useLayoutEffect } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import styled from "styled-components";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useQuery, useQueries } from "@tanstack/react-query";
import RequestHandler from "../../../../helpers/api/rest_handler";
import endpoints from "../../../../constants/endpoints";
import moment from "moment";
import CustomButton from "../../../../components/custom-button";
import { Context } from "../../../../helpers/context/context";
import * as Location from "expo-location";

const Subtitle = styled.Text`
  color: ${(props) => (props.color ? "#ffffff" : "#494d52")};
  font-weight: 500;
  font-size: 20px;
  padding-bottom: ${(props) => (props.margin ? "5px" : "10px")};
  margin-left: 0;
  text-align: ${(props) => (props.alignCenter ? "center" : null)};
`;

const ActiveBookingContainer = styled.View`
  border: 1px solid #00000010;
  background-color: #eee;
  border-radius: 10px;
`;

const ActiveBookingTab = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: ${(props) => (props.color ? "#d0d5d9" : "#fff")};
  opacity: ${(props) => (props.color ? "0.7" : "1")};
  overflow: hidden;
`;

const ActiveBookingImage = styled.Image`
  width: 100%;
  height: 120px;
`;

const SubtitleTwo = styled.Text`
  color: #494d52;
  font-weight: 300;
  font-size: 13px;
  margin-bottom: 10px;
`;

const ActiveBookingTextContainer = styled.Text`
  margin-bottom: ${(props) => (props.margin ? props.margin : "5px")};
  color: ${(props) => (props.color ? props.color : "#494d52")};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  font-size: ${(props) => (props.size ? "16px" : "14px")};
`;

const ItemComponent = ({bookings, navigation}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  async function fetchVehicle(vehicle_id, hotel_id) {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_VEHICLE(hotel_id, vehicle_id),
      undefined,
      undefined,
      true
    );

    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, vehicle prob doesnt exist or somthing
      //
    } else {
      return res;
    }
  }

  async function fetchHotel(hotel_id) {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_HOTEL(hotel_id),
      undefined,
      undefined,
      true
    );

    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, vehicle prob doesnt exist or somthing
      //
    } else {
      return res;
    }
  }


  const vehicleQueries = useQueries({
    queries:
      bookings.bookings?.map((item) => {
        return {
          queryKey: ["vehicle", item.vehicle_id, item.hotel_id],
          queryFn: () => fetchVehicle(item.vehicle_id, item.hotel_id),
          enabled: !!bookings,
        };
      }) ?? [],
  });

  const hotelQueries = useQueries({
    queries:
    bookings.bookings?.map((item) => {
        return {
          queryKey: ["hotel", item.hotel_id],
          queryFn: () => fetchHotel(item.hotel_id),
          enabled: !!bookings,
        };
      }) ?? [],
  });

  const isLoadVehicleHotel =
    vehicleQueries.every((result) => result.isLoading) &&
    hotelQueries.every((result) => result.isLoading);
  const isFetchedVehicleHotel =
    vehicleQueries.every((result) => result.isFetched) &&
    hotelQueries.every((result) => result.isFetched);
  const isErrVehicleHotel =
    vehicleQueries.every((result) => result.isError) &&
    hotelQueries.every((result) => result.isError);
    
  return (
    <View style={{
      paddingBottom: 40
    }}>
    {
    bookings.bookings ? (
      isLoadVehicleHotel ? (
        <ActivityIndicator size={"small"}></ActivityIndicator>
      ) : isErrVehicleHotel ? (
        <SubtitleTwo>
          Error loading your bookings. Please contact support at
          https://support.greenclick.app
        </SubtitleTwo>
      ) : isFetchedVehicleHotel ? (
        bookings.bookings.sort((a, b) => {
          if (a.active === b.active) return 0;
          return a.active ? -1 : 1;
        })?.map((item, index) => {
          return item.active ? (
            <ActiveBookingContainer key={item.id}  style={{
              marginTop: 10,
              marginBottom: 10
            }}>
              <ActiveBookingTab
                onPress={() => {
                  navigation.navigate("Order", {
                    bookingId: item.id,
                    active: true,
                  });
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                  s
                >
                  <ActiveBookingImage
                    source={{
                      uri: vehicleQueries[index].data.vehicle
                        .image_urls[0],
                    }}
                  ></ActiveBookingImage>
                </View>

                <View
                  style={{
                    flex: 2,
                    padding: 20,
                  }}
                >
                  <ActiveBookingTextContainer size bold>
                    {vehicleQueries[index].data.vehicle.model}
                  </ActiveBookingTextContainer>
                  <ActiveBookingTextContainer size margin={"8px"}>
                    {hotelQueries[index].data.hotel.name}
                  </ActiveBookingTextContainer>
                  <View
                    style={{
                      borderTopColor: "#00000010",
                      borderTopWidth: 1,
                      paddingTop: 15,
                      marginTop: 7,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <Ionicons
                        style={{
                          paddingTop: 1,
                          paddingRight: 5,
                        }}
                        name="calendar"
                        color={"#00000080"}
                      ></Ionicons>
                      <ActiveBookingTextContainer bold>
                        Start
                      </ActiveBookingTextContainer>
                    </View>

                    <ActiveBookingTextContainer margin={"12px"}>
                      {moment(item.start_date).format("LLL")}
                    </ActiveBookingTextContainer>
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <Ionicons
                        style={{
                          paddingTop: 1,
                          paddingRight: 5,
                        }}
                        name="calendar"
                        color={"#00000080"}
                      ></Ionicons>
                      <ActiveBookingTextContainer bold>
                        End
                      </ActiveBookingTextContainer>
                    </View>
                    <ActiveBookingTextContainer margin={"10px"}>
                      {moment(item.end_date).format("LLL")}
                    </ActiveBookingTextContainer>
                    {moment(currentDate).isAfter(
                      moment(item.end_date)
                    ) ? (
                      <ActiveBookingTextContainer bold color={"#f05157"}>
                        Your booking is{" "}
                        {moment(currentDate).diff(
                          moment(item.end_date),
                          "hours"
                        )}{" "}
                        hours overdue, please return your keys as soon as
                        possible.
                      </ActiveBookingTextContainer>
                    ) : moment(item.end_date).isSame(
                        moment(currentDate),
                        "day"
                      ) ? (
                      <ActiveBookingTextContainer bold color={"#eba910"}>
                        Your booking ends today, please return as soon as
                        possible.
                      </ActiveBookingTextContainer>
                    ) : "recieved_keys" in item ? (
                      <ActiveBookingTextContainer bold color={"#42ad56"}>
                        Click here to see your rental information and
                        return your keys.
                      </ActiveBookingTextContainer>
                    ) : (
                      <ActiveBookingTextContainer bold color={"#42ad56"}>
                        Click here to see your rental information and
                        recieve your keys.
                      </ActiveBookingTextContainer>
                    )}
                  </View>
                </View>
              </ActiveBookingTab>
            </ActiveBookingContainer>
          ) : (
            <ActiveBookingContainer style={{
              marginTop: 10,
              marginBottom: 10
            }}>
              <ActiveBookingTab
                onPress={() => {
                  navigation.navigate("Order", {
                    bookingId: item.id,
                    active: false,
                  });
                }}
                color
              >
                <View
                  style={{
                    flex: 1,
                  }}
                  s
                >
                  <ActiveBookingImage
                    source={{
                      uri: vehicleQueries[index].data.vehicle
                        .image_urls[0],
                    }}
                  ></ActiveBookingImage>
                </View>

                <View
                  style={{
                    flex: 2,
                    padding: 20,
                  }}
                >
                  <ActiveBookingTextContainer size bold>
                    {vehicleQueries[index].data.vehicle.model}
                  </ActiveBookingTextContainer>
                  <ActiveBookingTextContainer size margin={"8px"}>
                    {hotelQueries[index].data.hotel.name}
                  </ActiveBookingTextContainer>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Ionicons
                      style={{
                        paddingTop: 1,
                        paddingRight: 5,
                      }}
                      name="calendar"
                      color={"#00000080"}
                    ></Ionicons>
                    <ActiveBookingTextContainer>
                      {`${moment(item.start_date).format("L")} - ${moment(
                        item.end_date
                      ).format("L")}`}
                    </ActiveBookingTextContainer>
                  </View>
                </View>
              </ActiveBookingTab>
            </ActiveBookingContainer>
          );
        }) ?? []
      ) : (
        <ActivityIndicator size={"small"}></ActivityIndicator>
      )
    ) : (
      <View>
        <SubtitleTwo>
          No bookings found. Find a vehicle and rent today.
        </SubtitleTwo>
        <CustomButton
          onPress={() => {
            navigation.navigate("Map");
          }}
          title={"Search for Hotels"}
        ></CustomButton>
      </View>
    )
    }
    </View>
  )
}

const ActivityPage = ({ navigation }) => {
  const { location, setLocation, locationStatus, setLocationStatus } = useContext(Context);
  const [locationLoad, setLocationLoad] = useState(true);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        return;
    }
    //obtaining the users location
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest} );
    setLocation(location);
    setLocationStatus(status);
    setLocationLoad(false)
  };

  useLayoutEffect(()=> {
    getLocation()
  }, [])

  async function getBookings() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_USER_BOOKINGS(false),
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
    } else {
      // res.latch_id = Number
      // tell the user t expect their keys in "Latch #X"
      return res;
    }
  }

  
  const userBookings = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}
      >
        <Subtitle>Your Activity</Subtitle>
        {
        location ?
        <View>
        {userBookings.isLoading ? (
          <ActivityIndicator size={"small"}></ActivityIndicator>
        ) : userBookings.isError ? (
          <SubtitleTwo>
            Error loading your bookings. Please contact support at
            https://support.greenclick.app
          </SubtitleTwo>
        ) : userBookings.data ? (
          <ItemComponent navigation={navigation} bookings={userBookings.data}></ItemComponent>
        ) : (
          <View>
            <SubtitleTwo>
              No bookings found. Find a vehicle and rent today.
            </SubtitleTwo>
            <CustomButton
              onPress={() => {
                navigation.navigate("Map");
              }}
              title={"Search for Hotels"}
            ></CustomButton>
          </View>
        )}
        </View>
        :
        locationLoad ?
        <View style={{
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 20
        }}>
        <ActivityIndicator size={'small'}></ActivityIndicator>
        </View>
        :
        locationStatus == 'granted' ?
        <></>
        :
        <View style={{
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 20
        }}>
          <Subtitle>Your Location was not found.</Subtitle>
          <SubtitleTwo>In order to use the greenclick app, please allow location permissions located in your devices settings.</SubtitleTwo>
        </View>  
        }
      </ScrollView>
    </View>
  );
};

export default ActivityPage;
