import React, {useRef} from 'react'
import {View, StyleSheet} from 'react-native'
import LottieView from 'lottie-react-native';

const LoadingScreen = () => {
    const animation = useRef(null);
    return (
        <View style={styles.animationContainer}>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 300,
                    height: 300,
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={{ uri: 'https://assets1.lottiefiles.com/packages/lf20_znsmxbjo.json' }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginBottom: 20
    },
    buttonContainer: {
        paddingTop: 20,
    },
});

export default LoadingScreen