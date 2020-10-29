import React from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from 'react-navigation-stack';
import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { enableScreens } from 'react-native-screens';

import AuthLoadingScreen from './screens/AuthLoadingScreen';
import HomeScreen from "./screens/HomeScreen";
import JournalScreen from "./screens/JournalScreen";
import StartScreen from './screens/StartScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AccountScreen from './screens/AccountScreen';
import TodoScreen from './screens/ToDoScreen';

import { Colors, Fonts } from './styles';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import PursuitOfHappiness from './modules/PursuitOfHappiness';
import LectionScreen from './screens/LectionScreen';

const translationGetters = {
  en: () => require('./src/translations/en.json'),
  de: () => require('./src/translations/de.json'),
}

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

const setI18nConfig = () => {
  const fallback = { languageTag: 'en' };
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
}

const createStack = Platform.select({ ios: createNativeStackNavigator, android: createStackNavigator});

export default class App extends React.Component {
  constructor() {
    super();
    console.disableYellowBox = true;
    if(Platform.OS === 'ios') {
      enableScreens();
    }
    setI18nConfig();
  }
  
  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig()
    .then(() => this.forceUpdate())
    .catch(error => {
      console.error(error)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.White} barStyle="dark-content" />

        <AppContainer />
      </View>
    );
  }
}

const defaultNavigationOptions = Platform.select({
  android: {
    headerTintColor: Colors.Black,
    headerStyle: {
      backgroundColor: Colors.White,
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  },
  ios: {
    headerTintColor: Colors.Black,
    largeTitle: true,
    translucent: true,
    headerStyle: {
      blurEffect: 'regular',
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    headerLargeTitleStyle: {
      fontFamily: "SFProDisplay-Bold",
    }
  },
})

const HomeStack = createStack({
  Home: HomeScreen,
  Account: AccountScreen,
},
{
  initialRouteName: 'Home',
  defaultNavigationOptions,
  navigationOptions: getTabBarOptions("Home", require('./assets/Home_Active.png'), require('./assets/Home_Inactive.png'))
});

const JournalStack = createStack({
  Journal: JournalScreen,
},
{
  initialRouteName: 'Journal',
  defaultNavigationOptions,
  navigationOptions: getTabBarOptions("Journal", require('./assets/Journal_Active.png'), require('./assets/Journal_Inactive.png'))
});

const ToDoStack = createStack({
  ToDo: TodoScreen,
},
{
  initialRouteName: 'ToDo',
  defaultNavigationOptions,
  navigationOptions: getTabBarOptions("ToDo", require('./assets/ToDo_Active.png'), require('./assets/ToDo_Inactive.png'))
});

const TabNavigator = createBottomTabNavigator({
  HomeStack,
  JournalStack,
  ToDoStack,
},
{
  initialRouteName: 'HomeStack',
  tabBarOptions: {
    showLabel: false,
    style: {
      height: 64,
      backgroundColor: Colors.White,
    }
  },
});

const LectionStack = createStack({
  Lection: LectionScreen,
},
{
  initialRouteName: 'Lection',
  defaultNavigationOptions,
});

const MainWrapperStack = createStack({
  Main: TabNavigator,
  LectionStack,
}, {
  initialRouteName: "Main",
  mode: "modal",
  defaultNavigationOptions: {
    header: null,
    gestureResponseDistance: { vertical: 1000 },
    cardStyle: {
      opacity: 1.0,
      backgroundColor: "transparent",
    },

    ...TransitionPresets.ModalPresentationIOS,
    cardOverlayEnabled: true,
    gesturesEnabled: true,
  },
});

const LoginStack = createStack({
  Start: StartScreen,
  Login: LoginScreen,
  SignUp: SignUpScreen,
},
{
  initialRouteName: 'Start',
  defaultNavigationOptions: {
    ...defaultNavigationOptions,
    ...Platform.select({
      ios: {
        headerStyle: {
          backgroundColor: "transparent",
          largeTitle: false,
          translucent: false,
        }
      },
      android: {
        headerStyle: {
          backgroundColor: Colors.White,
        }
      }
    })
  }
});

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    LoginStack,
    Main: MainWrapperStack,
  },
  {
    initialRouteName: "AuthLoading",
    defaultNavigationOptions: {
      header: null
    }
  }
);

export function getTabBarOptions(label, active, inactive) {
  return {
    tabBarLabel: ({focused}) => <TabBarLabel title={label} focused={focused} />,
    tabBarIcon: ({focused}) => <TabBarIcon srcActive={active} srcInactive={inactive} focused={focused} />
  };
}

export function TabBarLabel(props) {
  return (
    <Text style={[styles.tabBarLabel, props.focused? styles.tabBarLabelActive : {}]} >{props.title}</Text>
  );
}
export function TabBarIcon(props) {
  return <Image source={props.focused ? props.srcActive : props.srcInactive} style={styles.tabBarIcon}/>
}

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  tabBarIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  tabBarLabel: {
    marginBottom: 1,
    fontSize: 11,
    color: Colors.ExtraLightGray,
    textAlign: 'center'
  },
  tabBarLabelActive: {
    color: Colors.DarkGray
  }
});