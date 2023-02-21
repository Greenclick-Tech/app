import React from "react";
import styled from "styled-components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";
import { Context } from "../../../../helpers/context/context";
import { Image, View, Text } from "react-native";
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
      console.log(res.error)
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
      console.log(res.error)
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
        queryFn: () => getBooking( route.params.bookingId),
        onSuccess: (data) => console.log(data)
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
  // useEffect(()=> {
  //   if(results[3].isFetched) {
  //     results[4].refetch()
  //     if(results[4].data && "received_keys" in results[4].data.booking ) {
  //       Alert.alert("Success!", "Your Box has been Unlocked, Please revieve your keys.")
  //     } else if (results[4].data && "returned_keys" in results[4].data.booking ) {
  //       Alert.alert("Success!", "Your Box has been Unlocked, Please return your keys.")
  //     }
  //   }
  // }, [results[3].data])

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
          Error loading your bookings. Please contact support at
          https://support.greenclick.app
        </Text>
      </View>
    );
  } else if (isSuccess) {
    main = (
      <Container>
        <DrawerScroll>
          <MapView
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
          </MapView>
          <BoxContainer>
            {
            route.params.active ? (
              results[2].data && "recieved_key" in results[2].data.booking ? (
                results[2].data && "returned_key" in results[2].data.booking ? (
                  <Title>Order is Active</Title>
                ) : (
                  <Title>Order has Completed</Title>
                )
              ) : (
                <Title>Order Confirmed</Title>
              )
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
                moment(currentDate).isAfter(
                  moment(results[2].data.booking.end_date)) ? (
                    <View
                      style={{
                        alignItems: "flex-start",
                        paddingBottom: 10,
                      }}
                    >
                      <ColoredText color={"#FF0000"}>
                        Order is Late
                      </ColoredText>
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: "flex-start",
                        paddingBottom: 10,
                      }}
                    >
                      <ColoredText color={"#4aaf6e"}>
                        Order is Active
                      </ColoredText>
                    </View>
                  )

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
                  {moment(results[2].data.booking.start_date).utc().format("LLL")}
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
                  {moment(results[2].data.booking.end_date).utc().format("LLL")}
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
                moment(currentDate).isAfter(
                  moment(results[2].data.booking.end_date)
                ) ? (
                  <MainText bold color={"#f05157"}>
                    Your booking is{" "}
                    {moment(currentDate).diff(
                      moment(results[2].data.booking.end_date),
                      "hours"
                    )}{" "}
                    hours overdue, please return your keys as soon as possible.
                  </MainText>
                ) : moment(results[2].data.booking.end_date).isSame(
                    moment(currentDate),
                    "day"
                  ) ? (
                  <MainText bold color={"#eba910"}>
                    Your booking ends today, please return as soon as possible.
                  </MainText>
                ) : "recieved_keys" in results[2].data.booking ? (
                  <MainText bold color={"#42ad56"}>
                    Your rental is now active. Please make sure to return your
                    keys before the return date.
                  </MainText>
                ) : (
                  <MainText bold color={"#42ad56"}>
                    Click below to recieve your keys and start your rental.
                  </MainText>
                )
              ) : (
                <></>
              )}

              {"recieved_keys" in results[2].data.booking ? (
                <DisclaimerTextReturn>
                  Orders returned late will be subject to late fees.
                </DisclaimerTextReturn>
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
            {route.params.active ? (
              <View
                style={{
                  borderWidth: 1,
                  padding: 15,
                  borderRadius: 10,
                  borderColor: "#00000020",
                }}
              >
                {results[2].data &&
                "received_keys" in results[2].data.booking ? (
                  "returned_keys" in results[2].data.booking ? (
                    <MainText>Vehicle Successfully Returned</MainText>
                  ) : (
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
                  )
                ) : (
                  <AddBody>
                    <BoxImageBody
                      source={require("../../../../assets/boxrad.png")}
                    ></BoxImageBody>
                    <ItemContainerAdd>
                      <CustomButton
                        onPress={() =>
                          navigation.navigate("Key Retrival", {
                            hotel_id: results[2].data.booking.hotel_id,
                            id: results[2].data.booking.id,
                            vehicle_id: results[2].data.booking.vehicle_id,
                          })
                        }
                        title={"Get your Key"}
                        bgcolor={"#4aaf6e"}
                        fcolor={"#fff"}
                        width={"100%"}
                      ></CustomButton>
                      <DisclaimerText>
                        By obtaining your rental vehicle key, you are agreeing
                        to our terms and conditions.
                      </DisclaimerText>
                    </ItemContainerAdd>
                  </AddBody>
                )}
              </View>
            ) : (
              <></>
            )}

            <Spacer></Spacer>
            {/* <Containing>
            <BoxRadImg
            source={require("../../../../assets/boxrad.png")}
            >

            </BoxRadImg>
        </Containing> */}
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
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.39,
            shadowRadius: 8.3,
            elevation: 13,
          }}
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
              {/* <Subtitle>How to Recieve your Rental Keys</Subtitle>
            <TextElement>
              To recieve your Rental keys, please stand within{" "}
              <Bold>5 meters</Bold> of the greenclick box. Then, tap the{" "}
              <Bold>Get Key</Bold> button above to open the latch.
            </TextElement>
            <Subtitle>How to Return your Vehicle Keys</Subtitle>
            <TextElement>
              To recieve your vehicle rentals keys, please stand within{" "}
              <Bold>5 meters</Bold> of the greenclick box. Then, tap the{" "}
              <Bold>Get Key</Bold> button above to open the latch.
            </TextElement> */}
              {tabState == "Overview" ? (
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
                  <Text style={{fontSize: 14}}>Need help with your booking? Contact us at</Text> 
                  <Text style={{fontSize: 14}}>https://support.greenclick.app</Text>
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

  return (
    // <Container>
    // <DrawerScroll>

    //   <MapView
    //     style={{ alignSelf: "stretch", height: 140 }}
    //     userInterfaceStyle={"light"}
    //     showsUserLocation={true}
    //     region={mapRegion}
    //   >
    //     <Marker coordinate={{ latitude: 49.283832, longitude: -123.119333 }}>
    //       <Image
    //         source={require("../../../../assets/pin.png")}
    //         style={{ flex: 1, width: 30 }}
    //         resizeMode={"contain"}
    //         resizeMethod="scale"
    //       ></Image>
    //     </Marker>
    //     <Circle
    //       strokeColor={"#abcaea"}
    //       fillColor="#abcaea"
    //       radius={7}
    //       center={{ latitude: 49.283832, longitude: -123.119333 }}
    //     ></Circle>
    //   </MapView>
    //   <BoxContainer>
    //     {"recieved_key" in results[4].data.booking ?
    //       "returned_key" in results[4].data.booking ?
    //       <Title>Order is Active.</Title>
    //       :
    //       <Title>Order has Completed.</Title>

    //     :
    //       <Title>Order Confirmed.</Title>
    //     }

    //     <MainIconFlex>
    //       <OrderNumber>Order Number: #{results[4].data.booking.id}</OrderNumber>
    //     </MainIconFlex>
    //     <SeperatorFull></SeperatorFull>
    //     <View>
    //     <MainText>Return By: January 1st, 2022, 11:59pm</MainText>
    //     <DisclaimerTextReturn>Orders returned late will be subject to late fees.</DisclaimerTextReturn>
    //     <SeperatorFull></SeperatorFull>
    //     </View>
    //     {"recieved_key" in results[4].data.booking ?
    //       "returned_key" in results[4].data.booking ?
    //       <GreenBox>
    //         <Swiper containerStyle={{
    //             height: 70
    //         }}
    //         paginationStyle={{
    //             marginBottom: -35
    //         }}
    //         >
    //             <GreenBoxItem>
    //             <GreenBoxText>Please stand 5 meters near Greenclick Box vicinity.</GreenBoxText>
    //             <Ionicons name="navigate-circle" size={45} color={'#fff'}></Ionicons>
    //             </GreenBoxItem>
    //             <GreenBoxItem>
    //             <GreenBoxText>Tap "Return your Key" and wait for the box to open.</GreenBoxText>
    //             <Ionicons name="phone-portrait" size={45} color={'#fff'}></Ionicons>
    //             </GreenBoxItem>
    //             <GreenBoxItem>
    //             <GreenBoxText>Return your key and close the corrisponding latch.</GreenBoxText>
    //             <Ionicons name="lock-closed" size={45} color={'#fff'}></Ionicons>
    //             </GreenBoxItem>
    //         </Swiper>

    //     </GreenBox>
    //       :
    //       <></>

    //     :
    //     <GreenBox>
    //     <Swiper containerStyle={{
    //         height: 70
    //     }}
    //     paginationStyle={{
    //         marginBottom: -35
    //     }}
    //     >
    //         <GreenBoxItem>
    //         <GreenBoxText>Please stand 5 meters near Greenclick Box vicinity.</GreenBoxText>
    //         {/* <BoxImage source={require('../../../../assets/box.png')}></BoxImage> */}
    //         <Ionicons name="navigate-circle" size={45} color={'#fff'}></Ionicons>
    //         </GreenBoxItem>
    //         <GreenBoxItem>
    //         <GreenBoxText>Tap "Get your Key" and wait for the box to open.</GreenBoxText>
    //         <Ionicons name="phone-portrait" size={45} color={'#fff'}></Ionicons>
    //         </GreenBoxItem>
    //         <GreenBoxItem>
    //         <GreenBoxText>Obtain your key and close the corrisponding latch.</GreenBoxText>
    //         <Ionicons name="lock-closed" size={45} color={'#fff'}></Ionicons>
    //         </GreenBoxItem>
    //     </Swiper>

    // </GreenBox>
    //     }

    //     {"recieved_key" in results[4].data.booking ?
    //       "returned_key" in results[4].data.booking ?
    //       <AddBody reverse>
    //         <BoxImageBody source={require('../../../../assets/boxrad.png')}>
    //         </BoxImageBody>
    //         <ItemContainerAdd>
    //             <CustomButton
    //             title={"Return your Key"}
    //             bgcolor={"#4aaf6e"}
    //             fcolor={"#fff"}
    //             width={"100%"}
    //             onPress={()=> handleReturnBox()}
    //             ></CustomButton>
    //             <DisclaimerText>By returning your key, you are ending your car rental period.</DisclaimerText>
    //         </ItemContainerAdd>
    //     </AddBody>
    //       :
    //       <></>
    //     :
    //     <AddBody>
    //     <BoxImageBody source={require('../../../../assets/boxrad.png')}>
    //     </BoxImageBody>
    //     <ItemContainerAdd>
    //         <CustomButton
    //         onPress={()=> handleOpenBox()}
    //         title={"Get your Key"}
    //         bgcolor={"#4aaf6e"}
    //         fcolor={"#fff"}
    //         width={"100%"}
    //         ></CustomButton>
    //         <DisclaimerText>By obtaining your rental vehicle key, you are agreeing to our terms and conditions.</DisclaimerText>
    //     </ItemContainerAdd>
    // </AddBody>
    //     }

    //     <Spacer></Spacer>
    //     {/* <Containing>
    //         <BoxRadImg
    //         source={require("../../../../assets/boxrad.png")}
    //         >

    //         </BoxRadImg>
    //     </Containing> */}

    //   </BoxContainer>
    // </DrawerScroll>

    //   <BottomSheet
    //     ref={bottomSheetRef}
    //     index={index}
    //     animateOnMount={true}
    //     snapPoints={snapPoints}
    //     onChange={handleSheetChanges}
    //     keyboardBehavior={"extend"}
    //     keyboardBlurBehavior={"restore"}
    //     backgroundStyle={"ViewStyle"}
    //     style={{
    //       shadowColor: "#000",
    //       shadowOffset: {
    //         width: 0,
    //         height: 6,
    //       },
    //       shadowOpacity: 0.39,
    //       shadowRadius: 8.3,
    //       elevation: 13,
    //     }}
    //   >
    //     <DrawerView>
    //       <Tabs>
    //         <IndividualTab
    //           onPress={() => {
    //             setTabState("Overview");
    //           }}
    //           color={tabState == "Overview"}
    //         >
    //           <TabItem color={tabState == "Overview"}>Overview</TabItem>
    //         </IndividualTab>
    //         <IndividualTab
    //           onPress={() => {
    //             setTabState("Events");
    //           }}
    //           color={tabState == "Events"}
    //         >
    //           <TabItem color={tabState == "Events"}>Events Nearby</TabItem>
    //         </IndividualTab>
    //       </Tabs>
    //       <DrawerScroll>
    //         {/* <Subtitle>How to Recieve your Rental Keys</Subtitle>
    //         <TextElement>
    //           To recieve your Rental keys, please stand within{" "}
    //           <Bold>5 meters</Bold> of the greenclick box. Then, tap the{" "}
    //           <Bold>Get Key</Bold> button above to open the latch.
    //         </TextElement>
    //         <Subtitle>How to Return your Vehicle Keys</Subtitle>
    //         <TextElement>
    //           To recieve your vehicle rentals keys, please stand within{" "}
    //           <Bold>5 meters</Bold> of the greenclick box. Then, tap the{" "}
    //           <Bold>Get Key</Bold> button above to open the latch.
    //         </TextElement> */}
    //         {tabState == "Overview" ? (
    //           <View>
    //             <Subtitle>Order Details</Subtitle>
    //             <GrayWrapper>
    //               <DateWrapper>
    //                 <TitleButtonWrapper>
    //                   <MiniSubtitle>Start Date</MiniSubtitle>
    //                 </TitleButtonWrapper>
    //                 <DateIconFlex>
    //                   <Ionicons
    //                     name={"calendar-outline"}
    //                     size={16}
    //                     color={"#3B414B"}
    //                   ></Ionicons>
    //                   <DateText>
    //                     1234
    //                     {/* {moment(route.params.startDate).toISOString()} */}
    //                   </DateText>
    //                 </DateIconFlex>
    //               </DateWrapper>
    //               <DateWrapper>
    //                 <TitleButtonWrapper>
    //                   <MiniSubtitle>End Date</MiniSubtitle>
    //                 </TitleButtonWrapper>
    //                 <DateIconFlex>
    //                   <Ionicons
    //                     name={"calendar-outline"}
    //                     size={16}
    //                     color={"#3B414B"}
    //                   ></Ionicons>
    //                   <DateText>
    //                     1234
    //                     {/* {moment(route.params.endDate).toISOString()} */}
    //                   </DateText>
    //                 </DateIconFlex>
    //               </DateWrapper>
    //               <DateWrapper>
    //                 <MiniSubtitle>Vehicle</MiniSubtitle>
    //                 <DateIconFlex>
    //                   <Ionicons
    //                     name={"car-outline"}
    //                     size={18}
    //                     color={"#3B414B"}
    //                   ></Ionicons>
    //                   <DateText>Model: Car</DateText>
    //                 </DateIconFlex>
    //                 <DateIconFlex>
    //                   <Ionicons
    //                     name={"information-circle-outline"}
    //                     size={18}
    //                     color={"#3B414B"}
    //                   ></Ionicons>
    //                   <DateText>Color: Blue</DateText>
    //                 </DateIconFlex>
    //               </DateWrapper>
    //               <DateWrapper>
    //                 <MiniSubtitle>Hotel</MiniSubtitle>
    //                 <DateIconFlex>
    //                   <Ionicons
    //                     name={"bed-outline"}
    //                     size={18}
    //                     color={"#3B414B"}
    //                   ></Ionicons>
    //                   <DateText>Hotel Name</DateText>
    //                 </DateIconFlex>
    //                 <DateIconFlex>
    //                   <Ionicons
    //                     name={"map-outline"}
    //                     size={18}
    //                     color={"#3B414B"}
    //                   ></Ionicons>
    //                   <DateText>Hotel Address</DateText>
    //                 </DateIconFlex>
    //                 <DateIconFlex>
    //                   <Ionicons
    //                     name={"call-outline"}
    //                     size={18}
    //                     color={"#3B414B"}
    //                   ></Ionicons>
    //                   <DateText>+1778-952-6800</DateText>
    //                 </DateIconFlex>
    //               </DateWrapper>
    //             </GrayWrapper>
    //             <Subtitle>Support</Subtitle>
    //           </View>
    //         ) : (
    //           <View>
    //             <Subtitle>Events Nearby</Subtitle>
    //           </View>
    //         )}
    //       </DrawerScroll>
    //     </DrawerView>
    //   </BottomSheet>
    // </Container>

    main
  );
};

export default OrderConfirmation;
