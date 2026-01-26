import { registerRootComponent } from 'expo';
import { WebView } from 'react-native-webview'; 
import { SafeAreaView, StatusBar, Platform } from 'react-native'; 

function App() { 
  return ( 
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}> 
      <StatusBar barStyle="light-content" />
      <WebView 
        source={{ uri: 'http://192.168.11.71:5173' }} 
        style={{ flex: 1 }}
        allowsBackForwardNavigationGestures={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        startInLoadingState={true}
        originWhitelist={['*']}
        scalesPageToFit={true}
      /> 
    </SafeAreaView> 
  ); 
} 

registerRootComponent(App);
