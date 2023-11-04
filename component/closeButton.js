import React from "react";
import { TouchableOpacity, Text, StyleSheet,View,Dimensions } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'
// Close Buttons 

const width = Dimensions.get('window').width;
const CloseButton = ({ onPress}) => {
  function handlePress() {
    onPress();
  }

  return (
          <View style={{flex:0.08}}>
              <TouchableOpacity onPress={handlePress} style={{ flex:1, alignSelf:"flex-end", margin:0}}>
                <View style={{flex:1}}>
                <FontAwesome5 name="window-close" size={width>=1000 ? 60 : 45} color="black" />
                </View>
            </TouchableOpacity>
          </View>
       )
};

const styles = StyleSheet.create({
  filterCloseButton: {
    height: 20,
    padding: 7,
  },
});

export default CloseButton;
