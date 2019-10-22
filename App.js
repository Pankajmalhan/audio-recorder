/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, Platform,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
var RNFS = require('react-native-fs');

class App extends React.Component {
  audioPath = Platform.OS === "android" ? RNFS.DocumentDirectoryPath + '/audio.wav' : AudioUtils.DocumentDirectoryPath + '/audio.wav';
  constructor(props) {
    super(props);
  }

  prepareRecordingPath() {
    AudioRecorder.prepareRecordingAtPath(this.audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "wav",
      AudioEncodingBitRate: 32000,
      MeteringEnabled: true,
      count: 0
    });
  }

  startAudioRecording = () => {
    try {
      RNFS.exists(this.audioPath).then((status) => {
        if (status) {
          RNFS.unlink(this.audioPath)
            .then(() => {
              console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
              console.log({ err });
            });
        }
      })
    } catch {
      alert("error");
    }
    this.recordStart();
  }

  recordStart = () => {
    ToastAndroid.show("Recording Start", 100)
    AudioRecorder.requestAuthorization().then((isAuthorised) => { //runtime permission
      if (!isAuthorised) { return this.props.navigation.goBack(); }
      this.prepareRecordingPath(this.audioPath);
      AudioRecorder.startRecording();
      AudioRecorder.onFinished = async (data) => {
        ToastAndroid.show("Recording Stop", 100)
      };
    });
  }

  recordStop = () => {
    AudioRecorder.stopRecording();
  }

  recordUpload = async () => {
    let audioObj = {
      name: "audio.wav",
      uri: "file://" + this.audioPath,
      type: "audio/wav"
    };
    try {
      const url = "http://192.168.103.139:8090/uploadandconvert/";
      const formData = new FormData();
      formData.append("audio", audioObj);
      console.log(url,formData)
      // console.log('formData', formData);
      // console.log("ormdata is" + JSON.stringify(formData))
      let options;
      //Add OAuth from headers
      options = Object.assign(
        {
          method: "POST",
          body: formData,
        }
      );
      let response = await fetch(url, options);
      console.log(await response.json())
    } catch (e) {
      console.log({ e })

    }
    finally {
    }
  }
  render() {
    return <>
      <TouchableOpacity onPress={this.startAudioRecording} style={{ height: 40, width: '90%', alignSelf: 'center', backgroundColor: '#3191e0', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
        <Text>Record Start</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={this.recordStop} style={{ height: 40, width: '90%', alignSelf: 'center', backgroundColor: '#ea6710', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
        <Text>Record Stop</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={this.recordUpload} style={{ height: 40, width: '90%', alignSelf: 'center', backgroundColor: '#10ea84', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
        <Text>Record Upload</Text>
      </TouchableOpacity>
    </>
  }
}
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
