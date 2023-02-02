//defining entry point for application
import { registerRootComponent } from 'expo';
import { View, Text } from 'react-native';

function App() {
  return <View><Text>Hello World!</Text></View>;
}

registerRootComponent(App);
