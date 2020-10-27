import { StyleSheet, Platform } from 'react-native';

export const Colors = {
  Black: "#000",
  White: "#FFF",

  ExtraDark: "#167f85",
  Dark: "#1a949c",
  Normal: "#1ea9b2",
  Light: "#22bec8",
  ExtraLight: "#26D4DF",

  SecondaryLight: "#ffff6e",
  Secondary: "#ffff4b",
  SecondaryDark: "#e5e543",

  ExtraDarkGray: "#1A1A1A",
  DarkGray: "#242424",
  LightGray: "#BCBCBC",
  ExtraLightGray: "#D8D8D8",

  Destructive: "#FF554C",
  Active: "#0A84FF",
}

export const Fonts = Platform.select({
  ios: {
    regular: {
      fontFamily: "SFProText-Regular"
    },
    medium: {
      fontFamily: "SFProText-Medium"
    },
    semibold: {
      fontFamily: "SFProText-Semibold"
    },
    bold: {
      fontFamily: "SFProText-Bold"
    },
    headlineSemibold: {
      fontFamily: "SFProDisplay-Semibold"
    },
    headlineSemibold: {
      fontFamily: "SFProDisplay-Bold"
    }
  },
  android: {
    regular: {
      fontWeight: "400"
    },
    medium: {
      fontWeight: "500"
    },
    semibold: {
      fontWeight: "600"
    },
    bold: {
      fontWeight: "700"
    },
    headlineSemibold: {
      fontFamily: "600"
    },
    headlineSemibold: {
      fontFamily: "700"
    }
  }
})

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  scrollContainer: {
    paddingBottom: 124,
    backgroundColor: Colors.White,
    flexGrow: 1,
  },
  viewContainer: {
    paddingBottom: 124,
    backgroundColor: Colors.White,
  },
  headerButtonImage: {
    width: 24,
    height: 24
  },
  headerButtonText: {
    color: Colors.Black,
    fontSize: 16,
    ...Fonts.medium
  },
  headerButton: Platform.select({
    ios: {},
    android: {
      marginRight: 16,
    }
  }),
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    ...Fonts.semibold,
  },
  actionButton: {
    flex: 1,
    alignSelf: "flex-start",
    justifyContent: 'center',
    alignItems: "center",
    width: 75,
  },
  actionButtonText: {
    fontSize: 11,
    ...Fonts.regular,
  },
  actionButtonImage: {
    width: 20,
    height: 20,
  },
  textInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: Colors.White,
    ...Fonts.regular,
    lineHeight: 20,
    fontSize: 17,
    borderWidth: 1,
    marginTop: 16,
    letterSpacing: -0.27,
  },
  infoText: {
    color: Colors.ExtraDark,
    textAlign: "center",
  },
  headline: {
    color: Colors.Black,
    fontSize: 20,
    marginHorizontal: 16,
    ...Fonts.headlineSemibold,
    letterSpacing: 0.38
  },
  tabViewText: {color: Colors.White, fontSize: 17, ...Fonts.semibold, lineHeight: 22, letterSpacing: -0.41},
  tabViewIndicator: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 9.5, height: 30, marginBottom: 8 },
  map: {
    flex: 1,
  },
});

export const profileStyles = StyleSheet.create({
  addButton: {
    width: 24,
    height: 24,
  },
  addImage: {
    width: 16,
    height: 16,
    margin: 4,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 4,
    alignSelf: "center",
  },
  userName: {
    color: Colors.White,
    fontSize: 23,
    ...Fonts.headlineSemibold,
    //lineHeight: 24,
    letterSpacing: 0.44,
    width: 150
  },
  subTitle: {
    color: Colors.Secondary,
    fontSize: 15,
    ...Fonts.regular,
    lineHeight: 20,
    letterSpacing: -0.24
  },
  tracksAmountText: {
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.24,
    ...Fonts.semibold,
    color: Colors.White,
  },
  tracksText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    ...Fonts.regular,
    color: Colors.LightGray,
  },
  friendButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.ExtraDarkGray,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  friendButtonText: {
    fontSize: 13,
    lineHeight: 16,
    ...Fonts.semibold,
    color: Colors.White,
  }
});

export const actionStyles = {
  body: {
    backgroundColor: "transparent",
    marginHorizontal: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  optionContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonBox: {
    height: 58,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.Black,
    marginTop: 0,
    backgroundColor: Colors.ExtraDarkGray,
    alignItems: "flex-start",
    paddingLeft: 12,
  },
  buttonText: {
    fontSize: 19,
    ...Fonts.regular,
    letterSpacing: -0.41,
  },
  cancelButtonBox: {
    height: 50,
    borderRadius: 16,
    backgroundColor: Colors.ExtraDarkGray,
    marginTop: 6,
  },
  cancelButtonText: {
    fontSize: 18,
    ...Fonts.semibold
  }
};

export const cardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  transparentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
			width: 0,
			height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5.46,
    elevation: 9,
  },
});

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageLeft: {
    backgroundColor: Colors.ExtraDarkGray,
    minWidth: 64,
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 4,
    marginLeft: 16,
    alignSelf: 'flex-start',
  },
  messageTracksLeft: {
    backgroundColor: Colors.ExtraDarkGray,
    width: "100%",
    paddingVertical: 12,
    marginVertical: 12,
  },
  messageLeftText: {
    color: "#fff",
    fontSize: 17,
    ...Fonts.regular,
    lineHeight: 23,
    letterSpacing: -0.41,
  },
  messageLeftDate: {
    fontSize: 12,
    color: Colors.LightGray,
    marginTop: 6,
    ...Fonts.regular,
    lineHeight: 14,
    letterSpacing: -0.29,
    textAlign: "right",
  },
  messageLeftName: {
    color: Colors.Normal,
    fontSize: 14,
    textAlign: "left",
    marginBottom: 6,
    ...Fonts.bold
  },
  messageRight: {
    backgroundColor: Colors.Dark,
    minWidth: 64,
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 4,
    marginRight: 16,
    alignSelf: 'flex-end',
  },
  messageTracksRight: {
    backgroundColor: Colors.ExtraDarkGray,
    width: "100%",
    paddingVertical: 12,
    marginVertical: 12,
  },
  messageRightText: {
    color: "#fff",
    fontSize: 17,
    textAlign: "left",
    ...Fonts.regular,
    lineHeight: 23,
    letterSpacing: -0.41,
  },
  messageRightDate: {
    fontSize: 12,
    color: Colors.ExtraLight,
    marginTop: 6,
    ...Fonts.regular,
    lineHeight: 14,
    letterSpacing: -0.29,
    textAlign: "right",
  },
  messageRightName: {
    color: Colors.ExtraDarkGray,
    fontSize: 14,
    textAlign: "right",
    marginBottom: 6,
    ...Fonts.bold
  },
  typeBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 8,
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    borderRadius: 8,
    backgroundColor: Colors.ExtraDarkGray,
    borderWidth: 0.5,
    borderColor: Colors.DarkGray,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    color: "#fff",
    overflow: "hidden",

    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.41,
    ...Fonts.regular,
  },
  sendButton: {
    width: 36,
    height: 36,
    marginHorizontal: 12,
    backgroundColor: Colors.Normal,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center"
  },
  sendIcon: {
    width: 16,
    height: 16,
    marginLeft: -2,
  },
  headerButtonImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    marginHorizontal: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  addIcon: {
    width: 16,
    height: 16,
  }
});

export const startStyles = StyleSheet.create({
  startBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  headline: {
    color: Colors.White,
    textAlign: "left",
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: 0.37,
    ...Fonts.headlineSemibold,
    marginTop: 24,
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    marginTop: 64,
    marginRight: 16
  },
  logo: {
    width: 54,
    height: 58,
    marginLeft: 8,
    marginTop: 8
  },
  subHeadline: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.32,
    ...Fonts.regular,
    color: Colors.LightGray,
    marginLeft: 8,
    marginTop: 4
  },
  forgotText: {
    fontSize: 13,
    color: Colors.White,
    lineHeight: 18,
    letterSpacing: -0.08,
    ...Fonts.semibold,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.Destructive,
    lineHeight: 14,
    letterSpacing: -0.19,
    ...Fonts.regular,
    marginLeft: 8,
    marginTop: 6,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
    ...Fonts.regular,
    color: Colors.LightGray
  }
});

export const serverStyles = StyleSheet.create({
  serverContainer: {
    width: 300,
    height: 170,
    borderRadius: 8,
    margin: 6,
    backgroundColor: Colors.ExtraDarkGray,
    overflow: "hidden",
  },
  serverName: {
    width: 160,
    fontSize: 22,
    lineHeight: 28,
    color: Colors.White,
    ...Fonts.headlineSemibold,
  },
  description: {
    marginTop: 4,
    width: 190,
    fontSize: 13,
    color: Colors.ExtraLightGray,
    ...Fonts.regular,
    letterSpacing: -0.08,
    maxHeight: 50,
    lineHeight: 20,
  },
  genreText: {
    fontSize: 12,
    color: Colors.White,
    ...Fonts.semibold,
  },
  genreBox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 18
  },
  serverIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
    marginTop: 12,
  },
  linkIcon: {
    width: 14,
    height: 14,
    marginLeft: 8,
  },
  serverChevron: {
    width: 22,
    height: 18
  },
  lockIcon: {
    width: 9,
    height: 9,
    marginTop: 2
  },
});

export const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  content: {
    backgroundColor: "transparent",
    borderColor: Colors.ExtraDarkGray,
    borderTopWidth: 0.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden"
  },
  header: {
    flexDirection: "row",
  },
  artwork: {
    overflow: "hidden",
    borderRadius: 2,
  },
  iconButton: {
    width: 48,
    height: 48,
    marginHorizontal: 8,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rateIcon: {
    width: 24,
    height: 24,
    margin: 14,
  },
  small_icon: {
    width: 16,
    height: 16,
    margin: 4,
    opacity: 0.6,
  },
  headerIconButton: {
    width: 60,
    height: 60,
    marginTop: -4, // TODO
  },
  headerIcon: {
    width: 16,
    height: 16,
    marginVertical: 14,
  },
  playButton: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
  },
  playIcon: {
    width: 60,
    height: 60,
  },
  mainTitle: {
    fontSize: 20,
    color: Colors.White,
    fontWeight: "600",
    textAlign: "left",
    marginLeft: 24,
    letterSpacing: 0.38,
    lineHeight: 24,
  },
  mainArtist: {
    color: "rgba(255,255,255,0.65)",
    textAlign: "left",
    fontSize: 14,
    letterSpacing: -0.08,
    lineHeight: 18,
    ...Fonts.regular,
    marginTop: 3,
  },
  posStyle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "500",
    zIndex: -1,
  },
  tabButton: {
    width: 48,
    height: 48,
    marginHorizontal: 16,
  },
  tabButton2: {
    height: 48,
    marginHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIcon: {
    width: 24,
    height: 24,
    margin: 12,
  },
  tabBar: {
    width: "100%",
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  typeBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingTop: 8,
    paddingLeft: 8,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  connectText: {
    color: Colors.White,
    marginHorizontal: 8,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.24,
    lineHeight: 20,
    ...Fonts.semibold,
  },
  connectIcon: {
    width: 14,
    height: 14,
    marginLeft: 12,
  },
  controlBox: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  userImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: "center",
    marginRight: 16,
  },
  editBtn: {
    marginRight: 24,
    marginTop: 24,
    marginLeft: 8,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  icon: {
    width: 20,
    height: 20
  },
  circleStyle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5
  },
  subtitleText: {
    marginTop: 3,
    fontSize: 13,
    letterSpacing: -0.12,
    color: "rgba(255,255,255,0.65)",
    ...Fonts.regular
  },
  addTracksButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)"
  },
});