import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
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
import { useQueries } from "@tanstack/react-query";
import { StripeProvider } from "@stripe/stripe-react-native";


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

const CarConfirm = ({ route, navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isChecked, setChecked] = useState(false);
  const [isPaymentVisible, setPaymentVisibility] = useState(false);
  const [card, setCard] = useState({});
  const [errorIntent, setErrorIntent] = useState('')

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
      console.log(`Error code: ${error.code}`, error.message);
      Alert.alert("Alert", error.message);
    } else {
      console.log(`Success, Your order is confirmed!`);
      Alert.alert(
        `Success! Order Confirmed`,
        `Your order was successfully confirmed.`
      );
      navigation.navigate("Order", {
        hotelId: route.params.hotelId,
        id: route.params.id,
        active: true,
      });
    }
  };

  async function fetchHotel() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_HOTEL(route.params.hotelId),
      undefined,
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

  async function fetchVehicle() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_VEHICLE(route.params.hotelId, route.params.id),
      undefined,
      undefined,
      true
    );
    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, hotel prob doesnt exist or somthing
      //
      console.log(res);
    } else {
      return res;
    }
  }

  async function fetchPaymentIntent() {
    let res = await RequestHandler(
      "POST",
      endpoints.CREATE_PAYMENT_INTENT(route.params.hotelId, route.params.id),
      {
        start_date: moment(route.params.startDate).toISOString(),
        end_date: moment(route.params.endDate).toISOString(),
      },
      undefined,
      true
    );
    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, hotel prob doesnt exist or somthing
      //
      setErrorIntent(res.error.message);
      console.log(res)
    } else {
      console.log(res)
      return res;
    }
  }

  async function fetchPaymentProperties() {
    let res = await RequestHandler(
      "POST",
      endpoints.GET_ORDER_SUBTOTAL(route.params.hotelId, route.params.id),
      {
        start_date: moment(route.params.startDate).toISOString(),
        end_date: moment(route.params.endDate).toISOString(),
      },
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
  const [pubKey, setPubKey] = useState("");


  const results = useQueries({
    queries: [
      {
        queryKey: ["hotel"],
        queryFn: () => fetchHotel(),
      },
      {
        queryKey: ["vehicle"],
        queryFn: () => fetchVehicle(),
      },
      {
        queryKey: ["paymentIntent"],
        queryFn: () => fetchPaymentIntent(),
        enabled: !!pubKey,
        cacheTime: 0
      },
      {
        queryKey: ["paymentProperties"],
        queryFn: () => fetchPaymentProperties(),
      },
      {
        queryKey: ["pubKey"],
        queryFn: () => getStripePub()
      }
    ],
  });


  async function getStripePub() {
    return await RequestHandler(
      "GET",
      endpoints.GET_PUBLISHABLE_KEY(),
      undefined,
      undefined,
      true
    );
  }

  useEffect(() => {
    if(results[4].isSuccess) {
      setPubKey(results[4].data.pub_key)
    }
  }, [results[4].data]);

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  const hidePaymentPicker = (type) => {
    setPaymentVisibility(false);
  };

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
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 20}}>
          <Title>An Error has Occured</Title>
          {errorIntent == 'User already has an active booking.' ?
          <Subtitle>You already have an active booking on your account. Users can only rent 1 vehicle at a time.</Subtitle>
            :
          <Subtitle>An unidentified error has occured, please try again.</Subtitle>

          }
        </View>
      </View>
    );
  } else {
    main = (
      <StripeProvider publishableKey={pubKey}>
      <View style={{ flex: 1 }}>
        {results[2].data.client_secret ? (
          <View style={{ flex: 1 }}>
            {/* <ModalView
              visible={isPaymentVisible}
              transparent={true}
              animationType="slide"
              swipeDirection="down"
              onSwipeComplete={hidePaymentPicker}
            >
              <ModalContent activeOpacity={1} onPress={hidePaymentPicker}>
                <ModalMargin activeOpacity={1}>
                  
                  <PaddingContent>
                    <MiniSubtitle>Payment Information</MiniSubtitle>
                    <CardField
                      postalCodeEnabled={true}
                      placeholders={{
                        number: "4242 4242 4242 4242",
                      }}
                      cardStyle={{
                        backgroundColor: "#f5f6f7",
                        textColor: "#000000",
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#dee1e3",
                      }}
                      style={{
                        width: "100%",
                        height: 60,
                        marginVertical: 10,
                        marginBottom: 20,
                      }}
                      onCardChange={(cardDetails) => {
                        setCard(cardDetails);
                      }}
                      onFocus={(focusedField) => {}}
                    />
                    <WrapperCheckbox>
                      <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? "#4630EB" : undefined}
                      />

                      <CheckboxText>Save this Card for Future Use</CheckboxText>
                    </WrapperCheckbox>

                    <WrapperFlex>
                      <ConfirmButton color={card.complete}>
                        <ConfirmText>Pay Now</ConfirmText>
                      </ConfirmButton>
                    </WrapperFlex>
                    <Disclaimer>
                      By clicking "Pay Now", you agree to our{" "}
                      <HighlightedText>Lorem Ipsum</HighlightedText> & our{" "}
                      <HighlightedText>Lorem Ipsum</HighlightedText>.
                    </Disclaimer>
                  </PaddingContent>
                </ModalMargin>
              </ModalContent>
            </ModalView> */}
            {results[1].data.vehicle && results[0].data.hotel ? (
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
                      <GrayWrapper>
                        <DateWrapper>
                          <TitleButtonWrapper>
                            <MiniSubtitle>Start Date</MiniSubtitle>
                            <ButtonEdit
                              onPress={() => {
                                navigation.navigate("Details", {
                                  id: route.params.id,
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
                              {moment(route.params.startDate).format("LL")}
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
                              {moment(route.params.endDate).format("LL")}
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
                          <DateIconFlex>
                            <Ionicons
                              name={"information-circle-outline"}
                              size={18}
                              color={"#3B414B"}
                            ></Ionicons>
                            <DateText>Color: Blue</DateText>
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

                      {results[3].data.receipt.map((e) => {
                        return (
                          <TitleButtonWrapperTwo>
                            <AdditionText>{e[0]}</AdditionText>
                            <AdditionText>
                              ${parseInt(e[1]).toFixed(2)}
                            </AdditionText>
                          </TitleButtonWrapperTwo>
                        );
                      })}

                      <WhiteWrapperTotal>
                        <TitleButtonWrapper>
                          <TotalText>Total</TotalText>
                          <TotalText color>
                            ${parseInt(results[3].data.subtotal).toFixed(2)}
                          </TotalText>
                        </TitleButtonWrapper>
                      </WhiteWrapperTotal>
                    </GeneralWrapper>
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
                    {/* <Button
                  title="test"
                  onPress={() => {
                    navigation.navigate("Order");
                  }}
                ></Button> */}
                  </ContainerPrice>
                </Footer>
              </SafeAreaView>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <View></View>
        )}
      </View>
      </StripeProvider>
    );
  }

  return main;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {},
});

export default CarConfirm;
