import React, { useContext, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const HealyChat = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);
  const [chatText, setChatText] = useState('');

  return (
    <SolidView
      isScrollEnabled
      keyboardVerticalOffset={Platform.OS == 'ios' ? 20 : 0}
      view={
        <View style={styles.mainContainer}>
          {/* Custom Header with Sidebar */}
          <HeaderCommon
            title={localization.appkeys.healyChat}
            rightIcon={images.sideBar}
            onRightPress={() => {}} // Handle sidebar/menu action
          />

          {/* Welcome Screen Logic */}
          <View style={styles.welcomeContainer}>
            <Image
              source={images.h}
              style={styles.logo}
              resizeMode="contain"
              tintColor={colors.primary}
            />
            <SolidText style={styles.welcomeText}>
              {localization.appkeys.chatWelcomePrompt}
            </SolidText>
          </View>

          {/* Chat Input Bar */}
          <View style={styles.footerContainer}>
            {/* Plus Button */}
            <TouchableOpacity style={styles.plusBtn}>
              <Image
                source={images.plus}
                style={styles.plusIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Main Input Box */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder={localization.appkeys.chatInputPlaceholder}
                placeholderTextColor="rgba(58,33,16,0.4)"
                value={chatText}
                onChangeText={setChatText}
                maxFontSizeMultiplier={1.4}
              />
              <TouchableOpacity
                onPress={() => {
                  if (chatText.trim().length > 0) {
                    Keyboard.dismiss();
                    setChatText(''); // Clear input on send
                  }
                }}
              >
                <Image
                  source={
                    chatText.trim().length > 0 ? images.send : images.microPhone
                  }
                  style={styles.micIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.listenBtn}>
                <Image
                  source={images.listen}
                  style={styles.listenIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Listen / Voice Wave Button */}
          </View>
        </View>
      }
    />
  );
};

export default HealyChat;
