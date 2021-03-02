import "react-native-gesture-handler";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
} from "react-native";
// import styled from "styled-components/native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";

// const StyledText = styled.Text`
//   color: red;
// `;


// declare const global: { HermesInternal: null | {} };

// console.log("test1");

// export const Test = observer(() => {
//   return <Text>Test text</Text>;
// });

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Registration: undefined;
};

const WelcomeStack = createStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

type WithNavigatorScreen = {
  navigation: ProfileScreenNavigationProp;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
});

const WelcomeScreen = ({navigation}: WithNavigatorScreen) => (
  <SafeAreaView>
    <View>
      <Text>Welcome1</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")}/>
    </View>
  </SafeAreaView>
);

console.log("test");

const LoginScreen = () => (
  <Text>Login</Text>
);

const RegistrationScreen = () => (
  <Text>RegistrationScreen</Text>
);

const App = () => {
  return (
    <>
    <StatusBar barStyle="dark-content"/>
        <NavigationContainer>
          <WelcomeStack.Navigator initialRouteName="Welcome" headerMode="none">
            <WelcomeStack.Screen name="Welcome" component={WelcomeScreen}/>
            <WelcomeStack.Screen name="Login" component={LoginScreen}/>
            <WelcomeStack.Screen name="Registration" component={RegistrationScreen}/>
          </WelcomeStack.Navigator>
        </NavigationContainer>
    </>
  );
};

// const App1 = () => {
//   return (
//     <NavigationContainer>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}
//         >
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Test />

//               <StyledText>Step One 1</StyledText>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.tsx</Text> to change
//                 this screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: "absolute",
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: "400",
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: "700",
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: "600",
//     padding: 4,
//     paddingRight: 12,
//     textAlign: "right",
//   },
// });

export default App;
