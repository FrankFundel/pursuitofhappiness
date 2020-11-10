import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles, Colors, Fonts, journalStyle } from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ListItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.done !== this.props.done) {
      this.toggleDone();
    }
  }

  toggleDone = () => {
    if(this.props.done) {
      this.dropdown.play(24, 100);
    }
  }

  render() {
    const { title, done, time, onPress, style } = this.props;

    return (
      <TouchableOpacity style={[journalStyle.content, {paddingVertical: 8}, style]} onPress={onPress}>
        <LottieView
          ref={animation => {
            this.dropdown = animation;
          }}
          source={require('../assets/lottie/checkbox.json')}
          loop={false}
          progress={done ? 1 : 0}
          style={{width: 28, height: 28, marginRight: 4}}
        />

        <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{title}</Text>

        {time && <Text style={[styles.text, {fontSize: 16, color: Colors.Active, textAlign: "right"}]}>{time}</Text>}
      </TouchableOpacity>
    );
  };
}