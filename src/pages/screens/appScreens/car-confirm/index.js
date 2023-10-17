import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import CustomButton from "../../../../components/custom-button";
import Swiper from "react-native-swiper";
import {
  useStripe,
} from "@stripe/stripe-react-native";
import RequestHandler from "../../../../helpers/api/rest_handler";
import endpoints from "../../../../constants/endpoints";
import { useQuery, useQueries } from "@tanstack/react-query";
import { StripeProvider } from "@stripe/stripe-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";


const Container = styled.View`
  width: 100%;
  flex: 1;
  padding: 0px 15px;
  border-radius-top-left: 30px;
  border-radius-top-right: 30px;
  background-color: #fff;
`;

const WrapperImage = styled.View`
  border-bottom-width: 1px;
  padding-bottom: 2px;
  border-bottom-color: #00000010;
  height: 200px;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  color: #3b414b;
  font-weight: bold;
  font-size: 26px;
  margin-bottom: 15px;
`;

const DateWrapper = styled.View`
  margin: 5px 0px;
`;

const Subtitle = styled.Text`
  color: #3b414b;
  font-weight: 600;
  font-size: 16px;
  padding-bottom: 10px;
  margin-left: 0;
`;

const MiniSubtitle = styled.Text`
  color: #3b414b;
  font-weight: 400;
  font-size: 16px;
  padding-bottom: 5px;
  padding-top: 5px;
  margin-left: 0;
`;

const GrayWrapper = styled.View`
  width: 100%;
  border: 1px solid #00000010;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  flex: 1;
  background-color: #f5f7f7;
  margin-top: 20px;
`;

const WhiteWrapperTotal = styled.View`
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 5px;
  flex: 1;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #00000010;
`;

const DateText = styled.Text`
  font-size: 16px;
  padding-left: 10px;
`;

const DateIconFlex = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 5px;
`;

const TitleButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const TitleButtonWrapperTwo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 5px 20px;
`;

const ButtonEdit = styled.TouchableOpacity``;

const ButtonText = styled.Text`
  font-size: 16px;
  color: #4aaf6e;
`;

const GeneralWrapper = styled.View`
  width: 100%;
  padding: 10px 0px;
  flex: 1;
`;

const ModalView = styled.Modal`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ModalMargin = styled.TouchableOpacity`
  flex: 0.6;
  margin-top: auto;
  background-color: #fff;
  padding: 30px 0px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 1;
  pointer-events: none;
`;

const ModalContent = styled.TouchableOpacity`
  flex: 1;
  background-color: #00000050;
`;

const WrapperFlex = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  padding: 25px 0px;
`;

const ConfirmButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.color ? "#4aaf6e" : "#AAA")};
  flex: 1;
  padding: 16px 14px;
  border-radius: 6px;
`;

const ConfirmText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 500;
`;

const Footer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: #00000020;
  padding: 20px 20px;
  padding-bottom: 40px;
`;

const ContainerPrice = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TotalText = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => (props.color ? "#4aaf6e" : "#3B414B")};
`;

const AdditionText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #3b414b;
`;
const ImageCars = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

const PaddingContent = styled.View`
  padding: 0px 20px;
  flex: 1;
  width: 100%;
`;

const Disclaimer = styled.Text`
  font-size: 12px;
  color: #3b414b90;
`;

const HighlightedText = styled.Text`
  color: #4aaf6e;
  font-size: 12px;
`;

const WrapperCheckbox = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CheckboxText = styled.Text`
  font-size: 16px;
  margin-left: 10px;
  color: #3b414b;
`;

const InformationBox = styled.View`
  flex-direction: ${props => props.reverse ? "row-reverse" : "row"};
  gap: 20px;  
  align-items: center;
  padding: 20px;
`;

const InsuranceBox = styled.View`
  flex-direction: row;
  gap: 10px;  
  align-items: center;
  padding-bottom: 10px;
`;

const InformationTitle = styled.Text`
  font-weight: 600;
  margin-bottom: 3px;
  color: #000000AA;
`;

const InformationText = styled.Text`
  color: #00000090;
  flex-shrink: 1
`;

const Bolding = styled.Text`
  font-weight: 500;
`;

const InsuranceWrapper = styled.View`
  padding: 10px 20px;
  border: 1px solid #00000010;
  margin-bottom: 20px;
`;

const InsuranceSelector = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 1px solid #00000010;
  background-color: ${props => props.active ? "#4aaf6e" : "#eeeeee"};
  margin: 0px 5px;
`;

const VerifyContainer = styled.View`
  padding: 10px 15px;
  background-color: ${props => props.isActive ? "#eeeeee" : "#FFFFFF"}
  border: 1px solid #00000010;
`;

const VerifyTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const VerifyDescription = styled.Text`
  font-size: 14px;
  margin-bottom: 15px;

`;

const PromoCodeInput = styled.TextInput`
  padding: 10px 10px;
  background-color: #eeeeee30;
  border: 1px solid #00000010;
  flex: 1;
  font-size: 16px;
  border-radius: 7px;
`;

const AddButton = styled.TouchableOpacity`
  padding: 10px 10px;
  background-color: ${props => props.active ? "#4aaf6e50": "#4aaf6e"}
  font-size: 16px;
  border-radius: 7px;
`;

const ResetButton = styled.TouchableOpacity`

`;

const ResetText = styled.Text`
  color: #ff0000;
  font-size: 12px;
`;


const CarConfirm = ({ route, navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isChecked, setChecked] = useState(false);
  const [isPaymentVisible, setPaymentVisibility] = useState(false);
  const [card, setCard] = useState({});
  const [errorIntent, setErrorIntent] = useState('')
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false)
  const [isCurrentInsurance, setCurrentInsurance] = useState(false)
  const [insurance, setInsurance] = useState('')
  const [promotion, setPromotion] = useState('')
  const [promotionText, setPromotionText] = useState('')

  const requestBodyPaymentProperties = {
    start_date: moment(startDate).utc().toISOString(),
    end_date: moment(endDate).utc().toISOString(),
  }

  const initializePaymentSheet = async () => {

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Greenclick Technologies",
      paymentIntentClientSecret: results[2].data.client_secret,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,

    });
    if (!error) {
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert("Alert", error.message);
    } else {
      Alert.alert(
        `Success! Order Confirmed`,
        `Your order was successfully confirmed.`
      );
      setPurchaseConfirmed(true)

    }
  };

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

  async function fetchPaymentIntent(hotelId, vehicleId) {
    let res = await RequestHandler(
      "POST",
      endpoints.CREATE_PAYMENT_INTENT(hotelId, vehicleId),
      {
        start_date: moment(route.params.startDate).utc().toISOString(),
        end_date: moment(route.params.endDate).utc().toISOString(),
      },
      undefined,
      true
    );
    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, hotel prob doesnt exist or somthing
      //
      if (res.error.code == "VERIFY_EMAIL") {
        handleVerifyEmail()
      }
      if (res.error.code == "VERIFY_IDENTITY") {
        navigation.navigate("User Verification", {
          vehicleId: route.params.vehicleId,
          hotelId: route.params.hotelId,
          startDate: moment(route.params.startDate),
          endDate: moment(route.params.endDate),
          origin: 'Confirm'
        })
      }
      return res;
    } else {
      return res;
    }
  }

  async function fetchPaymentProperties(hotelId, vehicleId, startDate, endDate, insurance, promotion) {
    let res = await RequestHandler(
      "POST",
      endpoints.GET_ORDER_SUBTOTAL(hotelId, vehicleId),
      requestBodyPaymentProperties,
      undefined,
      true
    );
    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, hotel prob doesnt exist or somthing
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


  const [pubKey, setPubKey] = useState("");


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
        queryKey: ["paymentIntent", route.params.hotelId, route.params.vehicleId, route.params.startDate, route.params.endDate],
        queryFn: () => fetchPaymentIntent(route.params.hotelId, route.params.vehicleId, route.params.startDate, route.params.endDate),
        enabled: !!pubKey && userEmail,
        cacheTime: 0,
        refetchOnWindowFocus: true
      },
      {
        queryKey: ["paymentProperties", route.params.hotelId, route.params.vehicleId, route.params.startDate, route.params.endDate, insurance, promotion],
        queryFn: () => fetchPaymentProperties(route.params.hotelId, route.params.vehicleId, route.params.startDate, route.params.endDate, insurance, promotion),
        onSuccess: (data) => {
          console.log(data)
        },
        onError: (data) => {
          console.log(data)
        }
      },
      {
        queryKey: ["pubKey"],
        queryFn: () => getStripePub(),
        onSuccess: (data) => {
          "error" in data ? setPubKey() : setPubKey(data.pub_key)
        }
      },
      {
        queryKey: ["user"],
        queryFn: () => fetchUser(),
      },
      {
        queryKey: ["insurances", route.params.vehicleId],
        queryFn: () => fetchInsurances(route.params.hotelId, route.params.vehicleId),
      }
    ],
  });

  const fetchInsurances = async (hotelId, vehicleId) => {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_VEHICLE_INSURANCES(hotelId, vehicleId),
      undefined,
      undefined,
      true
    );
    return res;
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
      return res;
    } else {
      return res;
    }
  }

  const handleVerifyEmail = async () => {
    let res = await RequestHandler(
      "post",
      endpoints.VERIFY(),
      { "email_address": getUser.data.user.email_address },
      "application/x-www-form-urlencoded",
    )
    if (res.error) {
      Alert.alert("An error has occured", res.error.message);
      navigation.navigate('Details')
    } else {
      navigation.navigate("Email Verification", {
        startDate: route.params.startDate,
        endDate: route.params.endDate,
        email: getUser.data.user.email_address,
        vehicleId: route.params.vehicleId,
        hotelId: route.params.hotelId,
        origin: 'Confirm'
      })

    }
  }

  const getUser = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
    refetchOnWindowFocus: 'always'
  });

  const userEmail = getUser?.data.user.email

  const activeBooking = useQuery({
    queryKey: ["activeBooking"],
    queryFn: () => getActiveBooking(),
    enabled: false,
    onSuccess: (data) => {
      if ("error" in data) {
        Alert.alert('An error has occured', data.error.message)
      } else {
        navigation.navigate("Order", {
          hotelId: route.params.hotelId,
          vehicleId: route.params.vehicleId,
          bookingId: data.bookings.id,
          active: true,
        });
      }

    }
  })

  useEffect(() => {
    if (purchaseConfirmed) {
      activeBooking.refetch()
    }
  }, [purchaseConfirmed])


  async function getStripePub() {
    return await RequestHandler(
      "GET",
      endpoints.GET_PUBLISHABLE_KEY(),
      undefined,
      undefined,
      true
    );
  }

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  const hidePaymentPicker = (type) => {
    setPaymentVisibility(false);
  };

  useEffect(()=> {
    if(insurance) {
      requestBodyPaymentProperties.insurance = insurance;
    }
    if(promotion) {
      requestBodyPaymentProperties.promotion = promotion;
    }
    results[3].refetch()
  }, [insurance, promotion])

  useEffect(() => {
    initializePaymentSheet();
  }, [results[2].data]);

  let main = null;

  if (isLoading) {
    main = (
      <ActivityIndicator
        style={{ paddingTop: 20 }}
        size={"small"}
      ></ActivityIndicator>
    );
  } else if (isError) {
    main = (
      <View>
        <Text>An Error has occured, please try again.</Text>
      </View>
    )
  } else {
    main = (
      <StripeProvider publishableKey={pubKey}>
        {
          pubKey ?

            <View style={{ flex: 1 }}>
              {
                "error" in results[2].data ?
                  results[2].data.error.code == 'VERIFY_EMAIL' || results[2].data.error.code == 'VERIFY_IDENTITY' ?
                    <View style={{ padding: 20 }}>
                      {/* <VerifyContainer>
                        <VerifyDescription>In order to continue, you must verify your email address.</VerifyDescription>
                        <CustomButton title={"Verify"} bgcolor={"#4aaf6e"} fcolor={"#fff"}></CustomButton>
                      </VerifyContainer> */}
                      <ActivityIndicator size={'small'}></ActivityIndicator>

                    </View>
                    :
                    <Text>{results[2].data.error.message}</Text>
                  :
                  <View style={{ flex: 1 }}>
                    {"error" in results[1].data ? (
                      <Text>{results[1].data.error.message}</Text>
                    ) : (
                      <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView>
                          <Container>
                            <Title>{results[1].data.vehicle.model}</Title>
                            <WrapperImage>
                              <Swiper
                                showsPagination={true}
                                dotColor="#fff"
                                activeDotColor="#4aaf6e"
                              >
                                {results[1].data.vehicle.image_urls.map((e) => {
                                  return (
                                    <View style={{ flex: 1, borderRadius: 5 }}>
                                      <ImageCars
                                        resizeMode="cover"
                                        source={{ uri: e }}
                                      ></ImageCars>
                                    </View>
                                  );
                                })}
                              </Swiper>
                            </WrapperImage>
                            <GeneralWrapper>
                              {
                                "error" in results[0].data ?
                                  <Text>{results[0].data.error.message}</Text>
                                  :
                                  <GrayWrapper>
                                    <DateWrapper>
                                      <TitleButtonWrapper>
                                        <MiniSubtitle>Start Date</MiniSubtitle>
                                        <ButtonEdit
                                          onPress={() => {
                                            navigation.navigate("Details", {
                                              vehicleId: route.params.vehicleId,
                                              hotelId: route.params.hotelId,
                                            });
                                          }}
                                        >
                                          <ButtonText>Edit</ButtonText>
                                        </ButtonEdit>
                                      </TitleButtonWrapper>
                                      <DateIconFlex>
                                        <Ionicons
                                          name={"calendar-outline"}
                                          size={16}
                                          color={"#3B414B"}
                                        ></Ionicons>
                                        <DateText>
                                          {moment(route.params.startDate).format("LLL")}
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
                                          {moment(route.params.endDate).format("LLL")}
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
                                        <DateText>
                                          Model: {results[1].data.vehicle.model}
                                        </DateText>
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
                                        <DateText>{results[0].data.hotel.name}</DateText>
                                      </DateIconFlex>
                                      <DateIconFlex>
                                        <Ionicons
                                          name={"map-outline"}
                                          size={18}
                                          color={"#3B414B"}
                                        ></Ionicons>
                                        <DateText>{results[0].data.hotel.address}</DateText>
                                      </DateIconFlex>
                                      <DateIconFlex>
                                        <Ionicons
                                          name={"call-outline"}
                                          size={18}
                                          color={"#3B414B"}
                                        ></Ionicons>
                                        <DateText>{results[0].data.hotel.phone}</DateText>
                                      </DateIconFlex>
                                    </DateWrapper>
                                  </GrayWrapper>
                              }
                              { results[6].data.insurances?.length > 0 ?

                              results[6].data.insurances.map((data)=> {
                                return (
                                  <InsuranceWrapper>
                                <DateWrapper>
                                  <MiniSubtitle>Select Insurance</MiniSubtitle>
                                </DateWrapper>
                                <InsuranceBox>
                                  <InsuranceSelector onPress={() => {
                                    setInsurance(insurance == data.id ? '' : data.id)
                                  }} active={insurance == data.id}></InsuranceSelector>
                                  <View style={{ flex: 5 }}>
                                    <InformationTitle>{data.name}</InformationTitle>
                                    <InformationText>
                                      {data.description}
                                    </InformationText>
                                  </View>
                                  <Image source={require("../../../../assets/bonzah.jpg")} style={{ resizeMode: "contain", flex: 1, height: 50, width: 50 }}></Image>

                                </InsuranceBox>
                              </InsuranceWrapper>
                                )
                              })
                                :
                                <></>
                                }

                            <InsuranceWrapper>
                                <DateWrapper>
                                  <MiniSubtitle>Add a Promo Code</MiniSubtitle>
                                </DateWrapper>
                                <InsuranceBox>
                                  <PromoCodeInput onChangeText={(text) => {
                                    setPromotionText(text)
                                  }}>
                                  </PromoCodeInput>
                                  <AddButton onPress={()=> {
                                    setPromotion(promotionText)
                                  }}><Text style={{color: "#ffffff", fontSize: 16}}>Add</Text></AddButton>
                                </InsuranceBox>
                                {
                                promotion && 
                                <ResetButton>
                                  <ResetText>Reset</ResetText>
                                </ResetButton>
                                }
                              </InsuranceWrapper>

                              {

                                "error" in results[3].data ?
                                  <Text>{results[3].data.error.message}</Text>
                                  :
                                  results[3].data.receipt.map((e) => {
                                    return (
                                      <TitleButtonWrapperTwo>
                                        <AdditionText>{e[0]}</AdditionText>
                                        <AdditionText>
                                          ${parseInt(e[1]).toFixed(2)}
                                        </AdditionText>
                                      </TitleButtonWrapperTwo>
                                    );
                                  })

                              }

                              {
                                "error" in results[3].data ?
                                  <></>
                                  :
                                  <WhiteWrapperTotal>
                                    <TitleButtonWrapper>
                                      <TotalText>Total</TotalText>
                                      <TotalText color>
                                        ${parseInt(results[3].data.subtotal).toFixed(2)}
                                      </TotalText>
                                    </TitleButtonWrapper>
                                  </WhiteWrapperTotal>

                              }

                            </GeneralWrapper>
                            {
                            moment(route.params.startDate).subtract(1, "days").isAfter(moment()) &&
                              
                              <InformationBox>
                                <Ionicons
                                  color="#00000090"
                                  name="thumbs-up-outline"
                                  size={38}
                                ></Ionicons>
                                <View style={{ flexShrink: 1 }}>
                                  <InformationTitle>Free Cancellation</InformationTitle>
                                  <InformationText>
                                    Recieve a full refund before <Bolding>{moment(route.params.startDate).subtract(1, "days").format('LLL')}.</Bolding>
                                  </InformationText>
                                </View>

                              </InformationBox>
                            }
                            <InformationBox reverse>
                              <Ionicons
                                color="#00000090"
                                name="car-outline"
                                size={42}
                              ></Ionicons>
                              <View style={{ flexShrink: 1 }}>
                                <InformationTitle>Access your Keys Easily</InformationTitle>
                                <InformationText>
                                  Your vehicle keys can be accessed on <Bolding> {moment(route.params.startDate).format("LL")} at {moment(route.params.startDate).format("LT")}</Bolding>.
                                </InformationText>
                              </View>
                            </InformationBox>
                          </Container>
                        </ScrollView>
                        <Footer>
                          <ContainerPrice>
                            <CustomButton
                              onPress={openPaymentSheet}
                              title={"Checkout"}
                              bgcolor={"#4aaf6e"}
                              fcolor={"#fff"}
                              width="100%"
                            ></CustomButton>
                          </ContainerPrice>
                        </Footer>
                      </SafeAreaView>
                    )}
                  </View>
              }
            </View>
            :
            <Text>{results[4].data.error.message}</Text>

        }
      </StripeProvider>
    )
  }
  return main;
};


export default CarConfirm;
