import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import { urls } from "../../constants/urls";

interface UpdatePopupProps {
  isVisible: boolean;
  onBackDropPress: () => void;
}

const UpdatePopup: React.FC<UpdatePopupProps> = ({ isVisible, onBackDropPress }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      style={{ borderWidth: 1, flex: 1 }}
    >
      <View style={style.parent}>
        <View style={style.popup}>
          <View
            style={{
              width: "90%",
              height: "90%",
            }}
          >
            <Text style={style.txtStyle}>{"Update your app"}</Text>

            <Text style={[style.txtStyle, { fontWeight: "500" }]}>
              {"To enjoy our newest features tap button below"}
            </Text>
            <TouchableOpacity
              onPress={()=> {
                Linking.openURL(Platform.OS == 'android' ? urls.androidAppLink : urls.iosAppLink)
              }}
              style={style.btnStyle}>
              <Text style={style.btnTxt}>{"Update Now"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default UpdatePopup;

const style = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    width: "85%",
    backgroundColor: "white",
    maxHeight: 240,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 7,
    alignSelf: "center",
    shadowColor: "grey",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
  },
  txtStyle: {
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center",
    color: "#363636",
    lineHeight: 25,
    marginTop: 20,
    marginHorizontal: 20,
    fontWeight: "bold",
  },
  btnStyle: {
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "green",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnTxt: {
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});
