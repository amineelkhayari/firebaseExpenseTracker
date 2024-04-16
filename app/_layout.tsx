import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { addDoc, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './Interfaces/Firebase';
import { useFonts } from 'expo-font';
import NetInfo from '@react-native-community/netinfo';
import { str } from './Interfaces/Storage';
import { Alert } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [isConnected, setIsConnected] = useState<boolean>(false); // Default to true to handle initial state
  const [loaded, error] = useFonts({
    am: require('../assets/fonts/SpaceMono-Regular.ttf')
  });
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state?.isConnected ?? false); // Ensure state.isConnected is properly handled
    });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {


    const asyncData = async () => {
      var value = await AsyncStorage.getItem('LocalExpense');
      if (value != null) {
        let val: Expense[] = JSON.parse(value);

        if (val.length > 0) {
          val.forEach(async (load: Expense) => {
            load.sync = !load.sync;
            //batch.set(doc(collection(db, "users",load.transaction)), load);
            // addDoc(collection(db, "users"), load);
            setDoc(doc(db, 'users', load.transaction), load);
            //console.log("change all Value to true",load)
          });
          if (isConnected) {
            await str.removeValue('LocalExpense')
            Alert.alert("Data Loaded", "From Local To Online");
          }


        }
      }

      //
    }
    if (loaded) {
      asyncData();
      SplashScreen.hideAsync();
    }

  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Layout />

}

function Layout() {




  return (
    <Stack

      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#0101',
        },
        headerTintColor: '#333',


        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Screens/Detail" options={{ headerShown: true, headerTitle: "Detail" }} />

    </Stack>
  );
}
