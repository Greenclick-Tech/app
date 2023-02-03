import React, {useRef} from 'react'
import styled from 'styled-components'
import LottieView from "lottie-react-native";

const AnimationCenter = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  color: #494d52;
  font-weight: 500;
  font-size: 26px;
  padding-left: 10px;
  text-align: ${(props) => (props.alignCenter ? "center" : null)};
`;

const Subtitle = styled.Text`
  color: #494d52;
  font-weight: 500;
  font-size: 18px;
  padding-bottom: ${(props) => (props.margin ? "3px" : "10px")};
  margin-left: 0;
  text-align: ${(props) => (props.alignCenter ? "center" : null)};
`;

const CarLoad = ({err}) => {
  const animation = useRef(null);

    return (
        <AnimationCenter>
    <LottieView
      autoPlay
      ref={animation}
      loop={true}
      style={{
        width: 250,
        height: 250,
      }}
      // Find more Lottie files at https://lottiefiles.com/featured
      source={{
        uri: "https://assets1.lottiefiles.com/packages/lf20_znsmxbjo.json",
      }}
    />
    <Subtitle alignCenter>{err}</Subtitle>
  </AnimationCenter>
    )
}

export default CarLoad