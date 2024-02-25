import React from "react";
import styled from "styled-components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";
import { Context } from "../../../../helpers/context/context";
import { Image, View, Text, RefreshControl } from "react-native";
import {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    useContext,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomButton from "../../../../components/custom-button";
import MapView, { Circle, Marker } from "react-native-maps";
import Swiper from "react-native-swiper";
import RequestHandler from "../../../../helpers/api/rest_handler";
import endpoints from "../../../../constants/endpoints";
import { useQueries, useQuery } from "@tanstack/react-query";
import moment from "moment";

const BoxContainer = styled.View`
  flex: 1;
  padding: 0px 15px;
  padding-top: 15px;
`;

const Title = styled.Text`
  color: #494d52;
  font-weight: 500;
  font-size: 26px;
  margin-bottom: 8px;
`;

const Button = styled.TouchableOpacity`
  padding: 20px;
  background-color: #abc;
  border-radius: 30px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  text-align: center;
`;

const Subtitle = styled.Text`
  color: #3b414b;
  font-weight: 600;
  font-size: 16px;
  padding-bottom: 10px;
  margin-left: 0;
`;

const DrawerView = styled.View`
  padding: 15px;
  flex: 1;
`;

const TextElement = styled.Text`
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 18px;
  color: #3b414b;
`;

const MiniSubtitle = styled.Text`
  color: #3b414b;
  font-weight: 400;
  font-size: 16px;
  padding-bottom: 5px;
  padding-top: 5px;
  margin-left: 0;
`;

const Container = styled.View`
  flex: 1;
`;

const GrayWrapper = styled.View`
  width: 100%;
  border: 1px solid #00000010;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: #f5f7f7;
  margin-top: 5px;
`;

const DateWrapper = styled.View`
  margin: 5px 0px;
`;

const TitleButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const DateText = styled.Text`
  font-size: 16px;
  padding-left: 10px;
`;

const MainText = styled.Text`
  font-size: 16px;
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  color: ${(props) => (props.color ? props.color : "#000")};
  line-height: 22px;

  
`;

const OrderNumber = styled.Text`
  font-size: 14px;
  color: #aaa;
`;

const MainIconFlex = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const DateIconFlex = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 5px;
`;

const DrawerScroll = styled.ScrollView`
  flex: 1;
`;

const Bold = styled.Text`
  color: #4aaf6e;
  font-weight: bold;
`;

const Tabs = styled.View`
  justify-content: space-around;
  flex-direction: row;
  padding-bottom: 25px;
`;

const IndividualTab = styled.TouchableOpacity`
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => (props.color ? "#4aaf6e" : "#3B414B50")};
`;

const TabItem = styled.Text`
  font-size: 22px;
  color: ${(props) => (props.color ? "#4aaf6e" : "#3B414B50")};
`;

const TextOr = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #3b414b50;
  text-align: center;
  background-color: #fff;
  width: 50px;
  z-index: 1;
`;

const SeperatorFull = styled.View`
  width: 100%;
  height: 1px;
  border-bottom-width: 1px;
  border-bottom-color: #00000010;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const GreenBox = styled.View`
  background-color: #4aaf6ecc;
  padding: 15px;
  border: 3px solid #4aaf6e;
  border-radius: 7px;
  margin-bottom: 25px;
`;

const GreenBoxItem = styled.View`
  border-radius: 7px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0px 15px;
`;

const GreenBoxText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  flex: 2;
  height: 50px;
`;

const BoxImage = styled.Image`
  max-width: 50px;
  max-height: 70px;
  resize-mode: contain;
  flex: 1;
`;

const BoxImageBody = styled.Image`
  max-width: 120px;
  max-height: 120px;
  resize-mode: contain;
  flex: 1;
`;

const ItemContainerAdd = styled.View`
  flex: 1;
  padding: 15px;
`;

const AddBody = styled.View`
  flex: 1;
  flex-direction: ${(props) => (props.reverse ? "row-reverse" : "row")};
  align-items: center;
`;

const DisclaimerText = styled.Text`
  font-size: 12px;
  color: #3b414b90;
  padding-top: 10px;
  text-align: center;
`;

const DisclaimerTextReturn = styled.Text`
  font-size: 14px;
  color: #3b414b90;
  padding-top: 10px;
`;

const Spacer = styled.View`
  height: 200px;
`;

const ColoredText = styled.Text`
  color: ${(props) => (props.color ? props.color : "#000")};
  font-size: 16px;
  font-weight: 600;
  border-color: ${(props) => (props.color ? props.color : "#000")};
  text-align: center;
  border-width: 1px;
  padding: 7px 15px;
  margin-bottom: 7px;
`;

const ButtonEdit = styled.TouchableOpacity``;

const OrderConfirmation = ({ route, navigation }) => {
    const [tabState, setTabState] = useState("Overview");
    const [index, setIndex] = useState(0);
    const { user, location } = useContext(Context);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["15%", "100%"], []);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const handleSheetChanges = useCallback((number) => {
        setIndex(number);
    }, []);

    const [mapRegion, setmapRegion] = useState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
    });


    async function fetchHotel(hotelId) {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_HOTEL(hotelId),
            undefined,
            undefined,
            true
        );
        if ("error" in res) {
            // SAHIL, HANDLE THIS
            // probably a 404, hotel prob doesnt exist or somthing
            //
            //console.log(res.error)
            return res;
        } else {
            return res;
        }
    }

    async function fetchVehicle(hotelId, vehicleId) {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_VEHICLE(hotelId, vehicleId),
            undefined,
            undefined,
            true
        );
        if ("error" in res) {
            // SAHIL, HANDLE THIS
            // probably a 404, hotel prob doesnt exist or somthing
            //
            return res;
        } else {
            return res;
        }
    }

    async function getBooking(id) {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_USER_BOOKING(id),
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

    const results = useQueries({
        queries: [
            {
                queryKey: ["hotel", route.params.hotelId],
                queryFn: () => fetchHotel(route.params.hotelId),
            },
            {
                queryKey: ["vehicle", route.params.hotelId, route.params.vehicleId],
                queryFn: () => fetchVehicle(route.params.hotelId, route.params.vehicleId),
            },
            {
                queryKey: ["booking", route.params.bookingId],
                queryFn: () => getBooking(route.params.bookingId),
                onSuccess: (data) => {
                    console.log(data)
                    setTimeout(() => {
                        setRefreshing(false)
                    }, 500)
                },
                onError: (data) => {
                    console.log(data)
                    setTimeout(() => {
                        setRefreshing(false)
                    }, 500)
                },
                refetchOnWindowFocus: 'always'
            }
            // {
            //   queryKey: ["nearbyBox"],
            //   queryFn: () => nearbyBox(),
            //   retry: false,
            //   enabled: false,
            // },
            // {
            //   queryKey: ["unlockBox"],
            //   queryFn: () => unlockBox(),
            //   enabled: false,
            // },
        ],
    });

    const isLoading = results.every((result) => result.isLoading)
    const isError = results.every((result) => result.isError)
    const isSuccess = results.every((result) => result.isSuccess)

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        results[2].refetch()
    }, []);

    let main = null;
    if (isLoading) {
        main = (
            <View>
                <ActivityIndicator
                    style={{ padding: 20 }}
                    size={"small"}
                ></ActivityIndicator>
            </View>
        );
    } else if (isError) {
        main = (
            <View>
                <Text>
                    Error loading your booking. Please contact support at
                    https://support.greenclick.app
                </Text>
            </View>
        );
    } else if (isSuccess) {
        main = (
            "error" in results[2].data ?
                <Text>
                    {results[2].data.error.message}
                </Text>
                :
                <Container>
                    <DrawerScroll refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>

                        {/* <MapView
                            style={{ alignSelf: "stretch", height: 140 }}
                            userInterfaceStyle={"light"}
                            showsUserLocation={true}
                            region={mapRegion}
                        >
                            <Marker
                                coordinate={{ latitude: 49.283832, longitude: -123.119333 }}
                            >
                                <Image
                                    source={require("../../../../assets/pin.png")}
                                    style={{ flex: 1, width: 30 }}
                                    resizeMode={"contain"}
                                    resizeMethod="scale"
                                ></Image>
                            </Marker>
                            <Circle
                                strokeColor={"#abcaea"}
                                fillColor="#abcaea"
                                radius={7}
                                center={{ latitude: 49.283832, longitude: -123.119333 }}
                            ></Circle>
                        </MapView> */}
                        <BoxContainer>
                            {
                                route.params.active ? (
                                    <Title>Order Summary</Title>
                                ) : (
                                    <Title>Your Order</Title>
                                )
                            }
                            <MainIconFlex>
                                <OrderNumber>
                                    Order Number: #{results[2].data && results[2].data.booking.id}
                                </OrderNumber>
                            </MainIconFlex>
                            <SeperatorFull></SeperatorFull>
                            <View
                                style={{
                                    paddingBottom: 20,
                                }}
                            >
                                {route.params.active ? (

                                    // Check if Rental Period has Started or Not
                                    moment(currentDate).isBefore(moment(results[2].data.booking.start_date)) ?
                                        //Has Not Started
                                        <View
                                            style={{
                                                alignItems: "flex-start",
                                                paddingBottom: 10,
                                            }}
                                        >
                                            <ColoredText color={"#42ad56"}>
                                                Booking Period has not Started
                                            </ColoredText>
                                        </View>
                                        :
                                        moment(currentDate).isBefore(moment(results[2].data.booking.end_date)) ?
                                            //Has Started
                                            "received_keys" in results[2].data.booking ?
                                                <View
                                                    style={{
                                                        alignItems: "flex-start",
                                                        paddingBottom: 10,
                                                    }}
                                                >
                                                    <ColoredText color={"#42ad56"}>
                                                        Order is Active
                                                    </ColoredText>
                                                </View>
                                                :
                                                <View
                                                    style={{
                                                        alignItems: "flex-start",
                                                        paddingBottom: 10,
                                                    }}
                                                >
                                                    <ColoredText color={"#42ad56"}>
                                                        Order is Ready to be Activated
                                                    </ColoredText>
                                                </View>
                                            :
                                            //Has Ended
                                            <View
                                                style={{
                                                    alignItems: "flex-start",
                                                    paddingBottom: 10,
                                                }}
                                            >
                                                <ColoredText color={"#FF0000"}>
                                                    Order is Overdue
                                                </ColoredText>
                                            </View>

                                ) : (
                                    <View
                                        style={{
                                            alignItems: "flex-start",
                                            paddingBottom: 10,
                                        }}
                                    >
                                        <ColoredText color={"#9197a3"}>Order Complete</ColoredText>
                                    </View>
                                )}
                                {route.params.active ?
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                paddingBottom: 10,
                                            }}
                                        >

                                            <MainText bold>Order Starts: </MainText>
                                            <MainText>
                                                {moment(results[2].data.booking.start_date).format("LLL")}
                                            </MainText>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                paddingBottom: 10,
                                            }}
                                        >

                                            <MainText bold>Return By: </MainText>
                                            <MainText>
                                                {moment(results[2].data.booking.end_date).format("LLL")}
                                            </MainText>
                                        </View>
                                    </View>
                                    :
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            paddingBottom: 10,
                                        }}
                                    >

                                        <MainText bold>Returned On: </MainText>
                                        <MainText>
                                            {moment(results[2].data.booking.end_date).format("LLL")}
                                        </MainText>
                                    </View>
                                }

                                {route.params.active ? (
                                    // Check if Rental Period has Started or Not
                                    moment(currentDate).isBefore(moment(results[2].data.booking.start_date)) ?
                                        //Has Not Started
                                        <MainText bold color={"#42ad56"}>
                                            Your rentals booking period has not started yet. You will be able to access your vehicle keys when the rental begins.
                                        </MainText>
                                        :
                                        moment(currentDate).isBefore(moment(results[2].data.booking.end_date)) ?
                                            //Has Started
                                            "received_keys" in results[2].data.booking ?
                                                <MainText bold color={"#42ad56"}>
                                                    Your rental period is active. Enjoy your trip! Please make sure to return your vehicle keys before the rental period is over.
                                                </MainText>
                                                :
                                                <MainText bold color={"#42ad56"}>
                                                    Your rental period is ready to be activated. You can access your vehicle keys by tapping "Get your Key".
                                                </MainText>
                                            :
                                            //Has Ended
                                            <MainText bold color={"#FF0000"}>
                                                Your rental period is over, return your keys immediately to avoid late fees.
                                            </MainText>

                                ) : (
                                    <></>
                                )}
                            </View>
                            {/* {results[2].data && "received_keys" in results[2].data.booking ? (
              results[2].data && "returned_keys" in results[2].data.booking ? (
                <GreenBox>
                  <Swiper
                    containerStyle={{
                      height: 70,
                    }}
                    paginationStyle={{
                      marginBottom: -35,
                    }}
                  >
                    <GreenBoxItem>
                      <GreenBoxText>
                        Please stand 5 meters near Greenclick Box vicinity.
                      </GreenBoxText>
                      <Ionicons
                        name="navigate-circle"
                        size={45}
                        color={"#fff"}
                      ></Ionicons>
                    </GreenBoxItem>
                    <GreenBoxItem>
                      <GreenBoxText>
                        Tap "Return your Key" and wait for the box to open.
                      </GreenBoxText>
                      <Ionicons
                        name="phone-portrait"
                        size={45}
                        color={"#fff"}
                      ></Ionicons>
                    </GreenBoxItem>
                    <GreenBoxItem>
                      <GreenBoxText>
                        Return your key and close the corrisponding latch.
                      </GreenBoxText>
                      <Ionicons
                        name="lock-closed"
                        size={45}
                        color={"#fff"}
                      ></Ionicons>
                    </GreenBoxItem>
                  </Swiper>
                </GreenBox>
              ) : (
                <></>
              )
            ) : (
              <GreenBox>
                <Swiper
                  containerStyle={{
                    height: 70,
                  }}
                  paginationStyle={{
                    marginBottom: -35,
                  }}
                >
                  <GreenBoxItem>
                    <GreenBoxText>
                      Please stand 5 meters near Greenclick Box vicinity.
                    </GreenBoxText>
                    {/* <BoxImage source={require('../../../../assets/box.png')}></BoxImage>
                    <Ionicons
                      name="navigate-circle"
                      size={45}
                      color={"#fff"}
                    ></Ionicons>
                  </GreenBoxItem>
                  <GreenBoxItem>
                    <GreenBoxText>
                      Tap "Get your Key" and wait for the box to open.
                    </GreenBoxText>
                    <Ionicons
                      name="phone-portrait"
                      size={45}
                      color={"#fff"}
                    ></Ionicons>
                  </GreenBoxItem>
                  <GreenBoxItem>
                    <GreenBoxText>
                      Obtain your key and close the corrisponding latch.
                    </GreenBoxText>
                    <Ionicons
                      name="lock-closed"
                      size={45}
                      color={"#fff"}
                    ></Ionicons>
                  </GreenBoxItem>
                </Swiper>
              </GreenBox>
            )} */}          
                            {
                            results[2].data.booking.active ?
                            <View>
                                
                                <View
                                    style={{
                                        borderWidth: 1,
                                        padding: 15,
                                        borderRadius: 10,
                                        borderColor: "#00000020",
                                        marginBottom: 20
                                    }}
                                >
                                    <AddBody>
                                        <BoxImageBody
                                            source={require("../../../../assets/boxrad.png")}
                                        ></BoxImageBody>
                                        <ItemContainerAdd>
                                            {
                                                moment(currentDate).isBefore(moment(results[2].data.booking.start_date)) ?
                                                    <CustomButton

                                                        title={"Get your Key"}
                                                        bgcolor={"#878787"}
                                                        fcolor={"#fff"}
                                                        width={"100%"}
                                                    ></CustomButton>
                                                    :
                                                    <CustomButton
                                                        onPress={() =>
                                                            navigation.navigate("Key Retrival", {
                                                                hotel_id: results[2].data.booking.hotel_id,
                                                                id: results[2].data.booking.id,
                                                                vehicle_id: results[2].data.booking.vehicle_id,
                                                            })
                                                        }
                                                        title={"received_keys" in results[2].data.booking ? "Open Lock Box" : "Get your Key"}
                                                        bgcolor={"#4aaf6e"}
                                                        fcolor={"#fff"}
                                                        width={"100%"}
                                                    ></CustomButton>
                                            }
                                        
                                                {
                                                    "received_keys" in results[2].data.booking ?
                                                    <DisclaimerText>Access your vehicle lock box at any time during your rental period.</DisclaimerText> 
                                                    :
                                                    <DisclaimerText>By obtaining your rental vehicle key, you are agreeing
                                                    to our terms and conditions.</DisclaimerText>
                                                }
                                                
                                            
                                        </ItemContainerAdd>
                                    </AddBody>
                                </View>
                                {"received_keys" in results[2].data.booking ?
                                <View
                                    style={{
                                        borderWidth: 1,
                                        padding: 15,
                                        borderRadius: 10,
                                        borderColor: "#00000020",
                                    }}
                                >
                                    <AddBody reverse>
                                        <BoxImageBody
                                            source={require("../../../../assets/boxrad.png")}
                                        ></BoxImageBody>
                                        <ItemContainerAdd>
                                            <CustomButton
                                                title={"Return Key"}
                                                bgcolor={"#4aaf6e"}
                                                fcolor={"#fff"}
                                                width={"100%"}
                                                onPress={() =>
                                                    navigation.navigate("Key Return", {
                                                        hotel_id: results[2].data.booking.hotel_id,
                                                        id: results[2].data.booking.id,
                                                        vehicle_id: results[2].data.booking.vehicle_id,
                                                    })
                                                }
                                            ></CustomButton>
                                            <DisclaimerText>
                                                By returning your key, you are ending your car rental
                                                period.
                                            </DisclaimerText>
                                        </ItemContainerAdd>
                                    </AddBody>
                                </View>
                                :
                                <></>
                                }
                            </View>
                            :
                            <></>
                            }
                            <Spacer></Spacer>
                            
                        </BoxContainer>
                    </DrawerScroll>
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={index}
                        animateOnMount={true}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                        keyboardBehavior={"extend"}
                        keyboardBlurBehavior={"restore"}
                        backgroundStyle={"ViewStyle"}
                    >
                        <DrawerView>
                            <Tabs>
                                <IndividualTab
                                    onPress={() => {
                                        setTabState("Overview");
                                    }}
                                    color={tabState == "Overview"}
                                >
                                    <TabItem color={tabState == "Overview"}>Overview</TabItem>
                                </IndividualTab>
                                <IndividualTab
                                    onPress={() => {
                                        setTabState("Events");
                                    }}
                                    color={tabState == "Events"}
                                >
                                    <TabItem color={tabState == "Events"}>Events Nearby</TabItem>
                                </IndividualTab>
                            </Tabs>
                            {
                                isLoading ?
                                    <ActivityIndicator size={"small"}></ActivityIndicator>
                                    :
                                    isError ?
                                        <Subtitle>An error occured fetching data. Please try again.</Subtitle>
                                        :
                                        <DrawerScroll>
                                            {tabState == "Overview" ? (
                                                "error" in results[0].data || "error" in results[1].data || "error" in results[2].data ?
                                                    <View>
                                                        {
                                                            "error" in results[0].data && (
                                                                <Text style={{ fontSize: 14 }}>{results[0].data.error.message}</Text>
                                                            )
                                                            ||
                                                            "error" in results[0].data && (
                                                                <Text style={{ fontSize: 14 }}>{results[0].data.error.message}</Text>
                                                            )
                                                            ||
                                                            "error" in results[0].data && (
                                                                <Text style={{ fontSize: 14 }}>{results[0].data.error.message}</Text>
                                                            )
                                                        }
                                                    </View>

                                                    :
                                                    <View>
                                                        <Subtitle>Order Details</Subtitle>
                                                        <GrayWrapper>
                                                            <DateWrapper>
                                                                <TitleButtonWrapper>
                                                                    <MiniSubtitle>Start Date</MiniSubtitle>
                                                                </TitleButtonWrapper>
                                                                <DateIconFlex>
                                                                    <Ionicons
                                                                        name={"calendar-outline"}
                                                                        size={16}
                                                                        color={"#3B414B"}
                                                                    ></Ionicons>
                                                                    <DateText>
                                                                        {moment(results[2].data.booking.start_date).format("LLL")}
                                                                    </DateText>
                                                                </DateIconFlex>
                                                            </DateWrapper>
                                                            <DateWrapper>
                                                                <TitleButtonWrapper>
                                                                    <MiniSubtitle>End Date</MiniSubtitle>
                                                                </TitleButtonWrapper>
                                                                <DateIconFlex>
                                                                    <Ionicons
                                                                        name={"calendar-outline"}
                                                                        size={16}
                                                                        color={"#3B414B"}
                                                                    ></Ionicons>
                                                                    <DateText>
                                                                        {moment(results[2].data.booking.end_date).format("LLL")}
                                                                    </DateText>
                                                                </DateIconFlex>
                                                            </DateWrapper>
                                                            <DateWrapper>
                                                                <MiniSubtitle>Vehicle</MiniSubtitle>
                                                                <DateIconFlex>
                                                                    <Ionicons
                                                                        name={"car-outline"}
                                                                        size={18}
                                                                        color={"#3B414B"}
                                                                    ></Ionicons>
                                                                    <DateText>{results[1].data?.vehicle?.model}</DateText>
                                                                </DateIconFlex>
                                                            </DateWrapper>
                                                            <DateWrapper>
                                                                <MiniSubtitle>Hotel</MiniSubtitle>
                                                                <DateIconFlex>
                                                                    <Ionicons
                                                                        name={"bed-outline"}
                                                                        size={18}
                                                                        color={"#3B414B"}
                                                                    ></Ionicons>
                                                                    <DateText>{results[0].data?.hotel?.name}</DateText>
                                                                </DateIconFlex>
                                                                <DateIconFlex>
                                                                    <Ionicons
                                                                        name={"map-outline"}
                                                                        size={18}
                                                                        color={"#3B414B"}
                                                                    ></Ionicons>
                                                                    <DateText>{results[0].data?.hotel?.address}</DateText>
                                                                </DateIconFlex>
                                                                <DateIconFlex>
                                                                    <Ionicons
                                                                        name={"call-outline"}
                                                                        size={18}
                                                                        color={"#3B414B"}
                                                                    ></Ionicons>
                                                                    <DateText>{results[0].data?.hotel?.phone}</DateText>
                                                                </DateIconFlex>
                                                            </DateWrapper>
                                                        </GrayWrapper>
                                                        <Subtitle>Support</Subtitle>
                                                        <Text style={{ fontSize: 14 }}>Need help with your booking? Contact us at</Text>
                                                        <Text style={{ fontSize: 14 }}>https://support.greenclick.app</Text>
                                                    </View>
                                            ) : (
                                                <View>
                                                    <Subtitle>Events Nearby</Subtitle>
                                                </View>
                                            )}
                                        </DrawerScroll>
                            }

                        </DrawerView>
                    </BottomSheet>
                </Container>
        );
        // main = <View></View>
    }

    return main;
};

export default OrderConfirmation;
