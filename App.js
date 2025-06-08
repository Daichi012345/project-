import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import MoodInputScreen from './screens/MoodInputScreen';
import MealSuggestionScreen from './screens/MealSuggestionScreen';
import HistoryScreen from './screens/HistoryScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';

const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack({ route }) {
  const { user } = route.params || {};

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{ user }}
        options={{ title: 'トップ' }}
      />
      <MainStack.Screen name="MoodInputScreen" component={MoodInputScreen} />
      <MainStack.Screen name="MealSuggestionScreen" component={MealSuggestionScreen} />
      <MainStack.Screen name="RecipeDetailScreen" component={RecipeDetailScreen} />
    </MainStack.Navigator>
  );
}


function MainTabs({ route }) {
  const { user } = route.params || {};
  console.log("✅ MainTabs user:", user);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        options={{ title: 'ホーム' }}
      >
        {() => <HomeStack route={{ params: { user } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="HistoryScreen"
        options={{ title: '履歴' }}
      >
        {() => <HistoryScreen route={{ params: { user } }} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="RegisterScreen">
        <RootStack.Screen name="RegisterScreen" component={RegisterScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
