import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles, Colors, Fonts } from '../styles';

export default class ListItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isActive !== this.props.isActive) {
      this.toggleActive();
    }
  }

  toggleActive = () => {
    if(this.props.isActive) {
      this.dropdown.play(0, 48);
    } else {
      this.dropdown.play(48, 96);
    }
  }

  render() {
    const { title, isActive } = this.props;

    return (
      <View style={[{paddingVertical: 8, flexDirection: "row", justifyContent: "space-between"}, isActive && {backgroundColor: Colors.WhiteGray}]}>
        <Text style={styles.headline}>{title}</Text>
        <LottieView
          ref={animation => {
            this.dropdown = animation;
          }}
          source={require('../assets/lottie/dropdown.json')}
          loop={false}
          style={{width: 24, height: 24, marginRight: 16}}
        />
      </View>
    );
  };
}