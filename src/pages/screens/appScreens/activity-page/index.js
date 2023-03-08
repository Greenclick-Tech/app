import React, { useState, useContext, useLayoutEffect, useCallback, useEffect } from "react";
import { ScrollView, View, ActivityIndicator, RefreshControl, Linking, TouchableOpacity, Text } from "react-native";
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
  background-color: #fff;
  border-radius: 10px;
`;

const ActiveBookingTab = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: ${(props) => (props.color ? "#d0d5d920" : "#fff")};
  opacity: ${(props) => (props.color ? "0.7" : "1")};
  overflow: hidden;
`;

const ActiveBookingImage = styled.Image`
  width: 100%;
  height: ${props => props.height ? "80px" : "120px"}
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

const ItemComponent = ({ bookings, navigation }) => {
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
              // const matchingVehicle = vehicleCalendar.find(
              //   (booking) => booking.data?.id === item.id
              // ) ?? {};
              return item.active ? (
                <ActiveBookingContainer key={item.id} style={{
                  marginTop: 10,
                  marginBottom: 10
                }}>
                  <ActiveBookingTab
                    onPress={() => {
                      navigation.navigate("Order", {
                        vehicleId: item.vehicle_id,
                        hotelId: item.hotel_id,
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
                        {
                          // Check if Rental Period has Started or Not
                          moment(currentDate).isBefore(moment(item.start_date)) ?
                            //Has Not Started
                            <ActiveBookingTextContainer bold color={"#42ad56"}>
                              Your booking period has not started just yet.
                            </ActiveBookingTextContainer>
                            :
                            moment(currentDate).isBefore(moment(item.end_date)) ?
                              //Has Started
                              "recieved_key" in item ?
                                <ActiveBookingTextContainer bold color={"#42ad56"}>
                                  Your booking period is activated.
                                </ActiveBookingTextContainer>
                                :
                                <ActiveBookingTextContainer bold color={"#42ad56"}>
                                  Your booking period is ready to be activated.
                                </ActiveBookingTextContainer>
                              :
                              //Has Ended
                              <ActiveBookingTextContainer bold color={"#42ad56"}>
                                Your booking period is overdue. Please return your vehicles keys immediately.
                              </ActiveBookingTextContainer>
                        }
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
                        vehicleId: item.vehicle_id,
                        hotelId: item.hotel_id,
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
                        height
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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationLoad(false)
      setLocationStatus(status)
      return;
    }
    //obtaining the users location
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
    setLocation(location);
    setLocationStatus(status);
    setLocationLoad(false)
  };

  useLayoutEffect(() => {
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

      return res
    } else {
      // res.latch_id = Number
      // tell the user t expect their keys in "Latch #X"
      return res;
    }
  }

  const userBookings = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
    onSuccess: (data) => {
      setTimeout(() => {
        setRefreshing(false)
      }, 500)
    },
  });

  useEffect(() => {
    if (refreshing) {
      setRefreshing(true)
      userBookings.refetch();
    }
  }, [refreshing])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}
        refreshControl={
          <RefreshControl tintColor={"#00000040"} refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                "error" in userBookings.data ?
                  <SubtitleTwo>
                    {userBookings.data.error.message}
                  </SubtitleTwo>
                  :
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
                  paddingTop: 20
                }}>
                  <Subtitle>Your Location was not found.</Subtitle>
                  <SubtitleTwo>In order to use the greenclick app, please allow location permissions located in your devices settings.</SubtitleTwo>
                  <TouchableOpacity onPress={() => {
                    Linking.openSettings()
                  }}>
                    <Text style={{ color: "#4aaf6e", fontSize: "16px" }}>Open Location Permissions</Text>
                  </TouchableOpacity>
                </View>
        }
      </ScrollView>
    </View>
  );
};

export default ActivityPage;
