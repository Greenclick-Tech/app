import React, { useState } from "react";
import styled from "styled-components";
import { View, Button } from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const PaddingContent = styled.View`
  padding: 0px 20px;
  flex: 1;
  width: 100%;
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
  position: absolute;
`;

const MiniSubtitle = styled.Text`
  color: #3b414b;
  font-weight: 400;
  font-size: 16px;
  padding-bottom: 5px;
  padding-top: 5px;
  margin-left: 0;
`;

const Nickname = styled.TextInput`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dee1e3;
  font-size: 16px;
  margin-top: 10px;
  background-color: #f5f6f7;
`;

const WrapperFlex = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
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

const Disclaimer = styled.Text`
  font-size: 12px;
  color: #3b414b90;
`;

const Highlight = styled.TouchableOpacity``;

const HighlightedText = styled.Text`
  color: #4aaf6e;
  font-size: 12px;
`;

const WhiteWrapperPayment = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #00000010;
`;

const WrapperPayment = styled.View`
  flex-direction: row;
  padding: 10px 0px;
`;

const AddPaymenTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #3b414b;
  margin-left: 10px;
`;

const SeperatorContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const PaymentSheet = () => {
  const [card, setCard] = useState({});
  const { confirmPayment, loading } = useConfirmPayment();

  return (
    <SafeAreaView style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>
      <View>
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
            marginBottom: 15,
          }}
          onCardChange={(cardDetails) => {
            setCard(cardDetails);
          }}
          onFocus={(focusedField) => {}}
        />

        <WrapperFlex>
          <ConfirmButton color={card.complete} disabled={loading}>
            <ConfirmText>Add Payment Method</ConfirmText>
          </ConfirmButton>
        </WrapperFlex>
        {/* <Disclaimer>
          By clicking "Pay Now", you agree to our{" "}
          <HighlightedText>Lorem Ipsum</HighlightedText> & our{" "}
          <HighlightedText>Lorem Ipsum</HighlightedText>.
        </Disclaimer> */}
      </View>
    </SafeAreaView>
  );
};

export default PaymentSheet;
