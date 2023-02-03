import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
import LottieView from "lottie-react-native";

const AnimationCenter = styled.View`
  align-items: center;
  padding: ${props=>props.padding ? "0px 15px" : "0px"}
  justify-content: center;
  width: ${props=>props.width};
  height: ${props=>props.height};
  margin-top: ${props=>props.offset ? props.offset : "0px"};
`;


const AnimatedSkeleton = ({width, height, offset, index, padding, display}) => {
    useEffect(()=> {
    }, [index])
    return (
        <AnimationCenter display={display} padding={padding} width={width} height={height} offset={offset}>
              <LottieView
                autoPlay
                autoSize={false}
                loop={true}
                resizeMode='cover'

                style={{
                  width: '100%',
                  height: '100%',
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={{uri: index }}
              />
            </AnimationCenter>
    )
}

AnimatedSkeleton.defaultProps={
    index: "https://assets1.lottiefiles.com/packages/lf20_rdwxkpdt.json"
}

export default AnimatedSkeleton