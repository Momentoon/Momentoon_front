/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Image, StyleSheet, Text } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeTab from '../screens/HomeTab';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import HomeIcon from '../assets/images/common/ic_home.png';
import SearchIcon from '../assets/images/common/ic_search.png';
import FoucesdIcon from '../assets/images/common/ic_focused.png';
import PlusIcon from '../assets/images/common/ic_plus.png';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme = {DarkTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveBackgroundColor: 'black',
        tabBarInactiveBackgroundColor: 'black',
        tabBarLabel: ''
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={HomeTab}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'MOMENTOON',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
          headerTitleAlign: 'left',
          tabBarIcon: ({focused}) => { 
            return (
              <>
              <Image source={HomeIcon} style={styles.tabIcon}></Image>
              <Image source={FoucesdIcon} style={focused? styles.indicator : styles.hideIndicator}></Image>
              </>
              )},
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              })}>
              <Image source={PlusIcon} style={{width: 18, height: 18, marginRight: 3}}/>
              <Text style={styles.createBtn}>create</Text>
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({focused}) => { 
            return (
              <>
              <Image source={SearchIcon} style={styles.tabIcon}></Image>
              <Image source={FoucesdIcon} style={focused? styles.indicator : styles.hideIndicator}></Image>
              </>  
            )},
        }}
      />
    </BottomTab.Navigator>
  );
}


const styles = StyleSheet.create({
  tabIcon: {
    width: 32,
    height: 32,
    marginTop: 10
  },
  indicator: {
    marginTop: 3,
    width: 6,
    height: 6
  },
  hideIndicator: {
    display: 'none'
  },
  createBtn: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 15
  }
});
