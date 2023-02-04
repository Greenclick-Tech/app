import React from "react";
import { useState, useEffect, useLayoutEffect, useContext, useRef } from "react";
import styled from "styled-components";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons";
import LogoSingle from '../../../../assets/logo-green-single'
import { LinearGradient } from "expo-linear-gradient";
import { easeGradient } from "react-native-easing-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context } from "../../../../helpers/context/context";
import { useIsFocused } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useQuery } from "@tanstack/react-query";
import endpoints from "../../../../constants/endpoints";
import RequestHandler from "../../../../helpers/api/rest_handler";
import LocationLoad from "../../../../components/location-load";
import { useFocusEffect } from "@react-navigation/native";
import AnimatedSkeleton from "../../../../components/animated-skeleton";
import moment from "moment";

const MapContainer = styled.View`
  width: 100%;
  height: 150px;
  flex: 2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
`;

const Title = styled.Text`
  color: #494d52;
  font-weight: 500;
  font-size: 26px;
  padding-left: 10px;
  text-align: ${(props) => (props.alignCenter ? "center" : null)};
`;

const Subtitle = styled.Text`
  color: ${(props) => (props.color ? "#ffffff" : "#494d52")};
  font-weight: 500;
  font-size: 20px;
  padding-bottom: ${(props) => (props.margin ? "5px" : "10px")};
  margin-left: 0;
  text-align: ${(props) => (props.alignCenter ? "center" : null)};
`;

const SubtitleTwo = styled.Text`
  color: ${(props) => (props.white ? "#FFF" : "#494d52")};
  font-weight: 300;
  font-size: 13px;
  margin-bottom: 10px;
`;

const NearestHotelContainer = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const AnimationCenter = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const HotelWrapper = styled.TouchableOpacity`
  padding-top: 0px;
  padding-bottom: 0px;
  width: 100%
  flex: 1;
  margin-right: 15px;
`;

const SecondaryWrapper = styled.View`
  border-radius: 10px;
  background-color: #fff;
`;

const HotelTitle = styled.Text`
  color: #3b414b;
  font-weight: 600;
  font-size: 16px;
`;

const HotelSubTitle = styled.Text`
  color: #3b414b75;
  font-weight: 500;
  font-size: 14px;
`;

const HotelImage = styled.ImageBackground`
  width: 100%;
  flex: 1;
  height: 100%;
`;

const StaticContainer = styled.View`
  padding: 15px;
  padding-top: 30px;
`;

const ItemContainer = styled.View`
  flex-direction: row;
`;

const NearbyHotel = styled.View`
  border-radius: 8px;
`;

const ItemWrapper = styled.View`
  margin-left: ${(props) => (props.left ? "5px" : "0px")};
  margin-right: ${(props) => (props.right ? "5px" : "0px")};
  flex: 1;
`;

const ItemMenu = styled.TouchableOpacity`
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  padding: 20px;
  height: 80px;
  background-color: ${(props) => (props.color ? "#4aaf6e" : "#4aaf6e20")};
`;

const TextItem = styled.Text`
  color: #494d52;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
`;

const SearchBar = styled.TouchableOpacity`
  width: 100%;
  padding: 12px 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  margin-top: 5px;
  flex-direction: row;
  background-color: #e8e8e8;
  align-items: center;
`;

const SearchBarPlaceholder = styled.Text`
  color: #494d5280;
  font-weight: 500;
  font-size: 18px;
  margin-left: 10px;
`;

const ActiveBookingContainer = styled.View`
  padding: 20px;
  background-color: #4aaf6e;
  padding-top: 30px;
`;

const ActiveBookingTab = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: {width: 0, height: 2};
  shadow-opacity: 0.8;
  elevation: 1;
`;

const ActiveBookingImage = styled.Image`
  width: 100%;
  height: 120px;
  border-radius-top-left: 10px;
`;

const ActiveBookingTextContainer = styled.Text`
  margin-bottom: ${(props) => (props.margin ? props.margin : "5px")};
  color: ${(props) => (props.color ? props.color : "#494d52")};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  font-size: ${(props) => (props.size ? "16px" : "14px")};
`;

const HomePage = ({ navigation, route }) => {
  const { location, setLocation, locationStatus, setLocationStatus } = useContext(Context);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [locationLoad, setLocationLoad] = useState(true);
  const [status, requestPermission] = Location.useForegroundPermissions();
  const { colors, locations } = easeGradient({
    colorStops: {
      0: {
        color: "#ffffff",
      },
      1: {
        color: "transparent",
      },
    },
    extraColorStopsPerTransition: 16,
  });
  const animation = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        return;
    }
    //obtaining the users location
    let location = await Location.getCurrentPositionAsync(
      { accuracy: Location.Accuracy.Lowest}
    );
    setLocation(location);
    setLocationStatus(status);
    setLocationLoad(false)
  };

  useLayoutEffect(()=> {
    getLocation()
  }, [])

  async function fetchData() {
    let res = await RequestHandler(
      "GET",
      endpoints.SEARCH_HOTELS({
        q: "nearest",
        long: location.coords.longitude,
        lat: location.coords.latitude,
      }),
      undefined,
      undefined,
      true
    );
    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 400, maybe the long/lat was malformed or server couldnt parse it, or something like that
      //
    } else {
      return res;
    }
  }

  async function getActiveBooking() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_USER_BOOKINGS(true),
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

  async function fetchVehicle() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_VEHICLE(
        activeBooking.data.booking.hotel_id,
        activeBooking.data.booking.vehicle_id
      ),
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

  async function fetchUser() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_CURRENT_USER(),
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

  async function fetchHotel() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_HOTEL(activeBooking.data.booking.hotel_id),
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

  const { isLoading, isError, data } = useQuery({
    queryKey: ["hotels"],
    queryFn: fetchData,
    enabled: !!location,
    retry: false,
  });

  const activeBooking = useQuery({
    queryKey: ["active"],
    queryFn: () => getActiveBooking(),
    cacheTime: 0
  });

  const getVehicle = useQuery({
    queryKey: ["vehicle"],
    queryFn: () => fetchVehicle(),
    enabled: activeBooking.isSuccess && "booking" in activeBooking.data,
  });

  const getHotel = useQuery({
    queryKey: ["hotel"],
    queryFn: () => fetchHotel(),
    enabled: activeBooking.isSuccess && "booking" in activeBooking.data,
  });

  useFocusEffect(
    React.useCallback(() => {
      activeBooking.refetch()
    }, [isFocused])
  );

  const getUser = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  })

  let main = null;

  main = (
      <View style={{ flex: 1 }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 20,
              justifyContent: "space-between",
              paddingBottom: 5,
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#dfe2e6",
            }}
          >
            <View
              style={{
                flex: 1,
                paddingLeft: 15,
                paddingRight: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <LogoSingle></LogoSingle>
              {getUser.isLoading ?
              <ActivityIndicator size={'small'}></ActivityIndicator>
              :
              <Title>Hey {getUser.data.user.first_name}</Title>
              }
            </View>
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => {
                navigation.navigate("Settings");
              }}
            >
              <Ionicons
                color={"#494d52"}
                name="md-person-circle-outline"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
        {
        location && (
          activeBooking.isLoading ? (
            <ActivityIndicator
              style={{ padding: 20 }}
              size={"small"}
            ></ActivityIndicator>
          ) : activeBooking.isError ? (
            <SubtitleTwo>
              An error occured retriving your booking details. Please contact
              support for assitance at https://support.greenclick.app/
            </SubtitleTwo>
          ) : "error" in activeBooking.data ? (
            <></>
          ) : (
            <ActiveBookingContainer>
              <Subtitle color>Your Active Booking</Subtitle>
              {activeBooking.isLoading ? (
                <ActivityIndicator
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  size={"small"}
                ></ActivityIndicator>
              ) : activeBooking.isError ? (
                <SubtitleTwo white>
                  Error loading your active booking. Please contact support at
                  https://support.greenclick.app
                </SubtitleTwo>
              ) : getVehicle.isLoading && getHotel.isLoading ? (
                <ActivityIndicator
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  size={"small"}
                ></ActivityIndicator>
              ) : getVehicle.isFetching && getHotel.isFetching ? (
                <ActivityIndicator
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  size={"small"}
                ></ActivityIndicator>
              ) : getVehicle.isFetched && getHotel.isFetched ? (
                getVehicle.isError && getHotel.isError ? (
                  <SubtitleTwo>
                    Error loading your active booking. Please contact support at
                    https://support.greenclick.app
                  </SubtitleTwo>
                ) : (
                  <ActiveBookingTab
                    onPress={() =>
                      navigation.navigate("Order", {
                        bookingId: activeBooking.data.booking.id,
                        active: true,
                      })
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                      }}
                      s
                    >
                      <ActiveBookingImage
                        source={{
                          uri: getVehicle.data.vehicle.image_urls[0],
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
                        {getVehicle.data.vehicle.model}
                      </ActiveBookingTextContainer>
                      <ActiveBookingTextContainer size margin={"8px"}>
                        {getHotel.data.hotel.name}
                      </ActiveBookingTextContainer>
                      <View
                        style={{
                          padding: 15,
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: "#00000020",
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
                          {moment(activeBooking.data.booking.start_date).format(
                            "LLL"
                          )}
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
                          {moment(activeBooking.data.booking.end_date).format(
                            "LLL"
                          )}
                        </ActiveBookingTextContainer>
                        {moment(currentDate).isAfter(
                          moment(activeBooking.data.booking.end_date)
                        ) ? (
                          <ActiveBookingTextContainer bold color={"#f05157"}>
                            Your booking is{" "}
                            {moment(currentDate).diff(
                              moment(activeBooking.data.booking.end_date),
                              "hours"
                            )}{" "}
                            hours overdue, please return your keys as soon as
                            possible.
                          </ActiveBookingTextContainer>
                        ) : moment(activeBooking.data.booking.end_date).isSame(
                            moment(currentDate),
                            "day"
                          ) ? (
                          <ActiveBookingTextContainer bold color={"#eba910"}>
                            Your booking ends today, please return as soon as
                            possible.
                          </ActiveBookingTextContainer>
                        ) : "recieved_keys" in activeBooking.data.booking ? (
                          <ActiveBookingTextContainer bold color={"#42ad56"}>
                            Click here to see your rental information and return
                            your keys.
                          </ActiveBookingTextContainer>
                        ) : (
                          <ActiveBookingTextContainer bold color={"#42ad56"}>
                            Click here to see your rental information and recieve
                            your keys.
                          </ActiveBookingTextContainer>
                        )}
                      </View>
                    </View>
                  </ActiveBookingTab>
                )
              ) : (
                <SubtitleTwo>
                  Error loading your active booking. Please contact support at
                  https://support.greenclick.app
                </SubtitleTwo>
              )}
            </ActiveBookingContainer>
          )
        )
        }
        <StaticContainer>
          <Subtitle margin>Rent a Car, E-Bike & More</Subtitle>
          <SubtitleTwo>
            Rent a car, e-bike, or other mobility solutions at your hotel using
            greenclick.
          </SubtitleTwo>
          <SearchBar
            onPress={() => {
              navigation.navigate("Map");
            }}
          >
            <Ionicons name="search" size={16}></Ionicons>
            <SearchBarPlaceholder>Search for Hotels</SearchBarPlaceholder>
          </SearchBar>
          <ItemContainer>
            <ItemWrapper right>
              <ItemMenu color>
                <Ionicons
                  color={"#fff"}
                  size={38}
                  name="car-sport"
                ></Ionicons>
              </ItemMenu>
              <TextItem>Vehicles</TextItem>
            </ItemWrapper>
            <ItemWrapper left right>
              <ItemMenu>
                <Ionicons
                  color={"#4aaf6e"}
                  size={38}
                  name="bicycle"
                ></Ionicons>
              </ItemMenu>
              <TextItem>E-Bikes</TextItem>
            </ItemWrapper>
            <ItemWrapper right left>
              <ItemMenu>
                <Ionicons
                  color={"#4aaf6e"}
                  size={38}
                  name="navigate-circle"
                ></Ionicons>
              </ItemMenu>
              <TextItem>Events</TextItem>
            </ItemWrapper>
            <ItemWrapper left>
              <ItemMenu>
                <Ionicons
                  color={"#4aaf6e"}
                  size={38}
                  name="help-circle"
                ></Ionicons>
              </ItemMenu>
              <TextItem>Support</TextItem>
            </ItemWrapper>
          </ItemContainer>
        </StaticContainer>
        {
        location ?
        <StaticContainer>
          {!isLoading && data ? (
            //Data Exists and is not loading
            <NearbyHotel>
              {data.hotels && data.hotels.length == 1 ? (
                <Subtitle>Nearest Hotel with Greenclick</Subtitle>
              ) : (
                <Subtitle>Nearest Hotels with Greenclick</Subtitle>
              )}
              {data.hotels ? (
                <HotelWrapper
                onPress={() => {
                  navigation.navigate("Map", {
                    hotelID: data.hotels[0].id,
                  });
                }}
              >
                <SecondaryWrapper>
                  <MapContainer>
                    <HotelImage
                      source={{
                        uri: data.hotels[0].image_urls[0],
                      }}
                      resizeMode="cover"
                    >
                      <LinearGradient
                        style={{
                          flex: 1,
                          justifyContent: "center",
                        }}
                        colors={colors}
                        locations={locations}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0.7 }}
                      ></LinearGradient>
                    </HotelImage>
                  </MapContainer>
                  <View style={{ flex: 1, height: 50 }}>
                    <NearestHotelContainer>
                      <View
                        style={{
                          position: "absolute",
                          zIndex: 2,
                        }}
                      >
                        <HotelTitle>{data.hotels[0].name}</HotelTitle>
                        <HotelSubTitle>
                          {data.hotels[0].address.length > 45
                            ? data.hotels[0].address.slice(0, 45) + "..."
                            : data.hotels[0].address}
                        </HotelSubTitle>
                      </View>
                      <View
                        style={{
                          maxWidth: "70%",
                          flex: 1,
                          alignItems: "flex-end",
                          marginLeft: "auto",
                        }}
                      ></View>
                    </NearestHotelContainer>
                  </View>
                </SecondaryWrapper>
              </HotelWrapper>
              ) : (
                <HotelSubTitle>No nearby hotels found.</HotelSubTitle>
              )}
            </NearbyHotel>
          ) : isError ? (
            //Data is Error
            <View>
              <Subtitle>Nearest Hotels with Greenclick</Subtitle>
              <HotelSubTitle>
                An error occured finding hotels, please try again.
              </HotelSubTitle>
            </View>
          ) : (
            <AnimatedSkeleton width={"100%"} height={"150px"}></AnimatedSkeleton>
          )}
        </StaticContainer>
        :
        locationLoad ?
        <ActivityIndicator style={{padding: 20}} size={'small'}></ActivityIndicator>
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
      </View>
    );

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
      edges={["top", "left", "right"]}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <ScrollView
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 30 }}
        >
          {main}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  }
});

export default HomePage;
