import React from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from 'react-navigation-stack';
import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { enableScreens } from 'react-native-screens';

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

import { Colors, Fonts } from './styles';

import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

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
        <StatusBar backgroundColor={Colors.Black} barStyle="light-content" />

        <AppContainer />
      </View>
    );
  }
}

const defaultNavigationOptions = Platform.select({
  android: {
    headerTintColor: Colors.White,
    headerStyle: {
      backgroundColor: Colors.Black,
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  },
  ios: {
    headerTintColor: Colors.White,
    largeTitle: true,
    translucent: true,
    headerStyle: {
      blurEffect: 'prominent',
      backgroundColor: 'transparent',
    },
    headerLargeTitleStyle: {
      fontFamily: "SFProDisplay-Bold",
    }
  },
})

const HomeStack = createStack({
  Home: HomeScreen,
},
{
  initialRouteName: 'Home',
  defaultNavigationOptions,
  navigationOptions: getTabBarOptions("Home", require('./assets/Home_Active.png'), require('./assets/Home_Inactive.png'))
});

const TabNavigator = createBottomTabNavigator({
  HomeStack,
},
{
  initialRouteName: 'HomeStack',
  tabBarOptions: {
    showLabel: false,
    style: {
      height: 50,
      backgroundColor: "transparent",
      borderTopWidth: 0,
    }
  },
});

const MainWrapperStack = createStack({
  Main: TabNavigator,
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
  Signup: SignupScreen,
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
          backgroundColor: Colors.ExtraDarkGray,
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
    backgroundColor: Colors.Black,
  },
  tabBarIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  tabBarLabel: {
    marginBottom: 1,
    fontSize: 11,
    color: Colors.White,
    textAlign: 'center'
  },
  tabBarLabelActive: {
    color: Colors.White
  }
});