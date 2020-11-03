import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import IconActionSheet from 'react-native-icon-action-sheet';
import { ContextMenuView as ContextMenu } from "react-native-ios-context-menu";
import { Colors } from '../styles';
import {translate} from "../App";

export default class ContextMenuView extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  showActionSheet = () => {
    const {title = "", options, onPress} = this.props;

    var menuItems = [];
    options.forEach((option, index) => {
      let {title, icon, destructive} = option;
      let item = {
        title,
        icon,
				titleTextAlignment: 0,
				titleTextColor: destructive ? Colors.Destructive : Colors.Black,
      };
      menuItems.push(item);
    });
    menuItems.push({
      title: translate('Cancel')
    });
    
    IconActionSheet.showActionSheetWithOptions(
			{
        title,
				cancelButtonIndex: menuItems.length,
				tintColor: Colors.Black,
				options: menuItems,
			}, index => {
        onPress(index);
      });
  }

  render() {
    const {title = "", options = [], onPress = () => {}} = this.props;

    var menuItems = [];
    options.forEach((option, index) => {
      let {title, icon, destructive} = option;
      let item = {
        actionKey: index.toString(),
        actionTitle: title,
      };
      if(destructive) item.menuAttributes = ["destructive"];
      menuItems.push(item);
    });

    return Platform.select({
      ios: <ContextMenu
        {...this.props}
        menuConfig={{
          menuTitle: title,
          menuItems,
        }}
        onPressMenuItem={({nativeEvent}) => {
          onPress(parseInt(nativeEvent.actionKey));
        }}
      />,
      android: <TouchableOpacity {...this.props} onLongPress={this.showActionSheet} />
    })
  };
}