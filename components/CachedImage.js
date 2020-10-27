import React from 'react';
import { Image } from 'react-native';

var RNFS = require('react-native-fs');

hashCode = s => s ? s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0) : null;

export const removeCachedImage = async uri => {
  try {
    uri = 'file://' + RNFS.CachesDirectoryPath + "/" + hashCode(uri);
    await RNFS.unlink(uri);
  } catch (err) {
    console.log(err);
  }
}

export default class CachedImage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      source: {uri: 'file://' + RNFS.CachesDirectoryPath + "/" + hashCode(this.props.image)},
    }
  }

  reloadImage = async () => {
    let uri = this.props.image;
    if(uri && uri.startsWith("https://")) {
      var path = 'file://' + RNFS.CachesDirectoryPath + "/" + hashCode(uri);
      await RNFS.downloadFile({ fromUrl: uri, toFile: path }).promise;
      this.setState({source: {uri: path}});
    } else {
      this.setState({source: this.props.defaultSource});
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.image !== this.props.image) {
      this.reloadImage();
    }
  }

  render() {
    const {style, defaultSource} = this.props;
    return <Image source={this.state.source || ""} style={style} defaultSource={defaultSource} onError={() => this.reloadImage()} />
  }
}