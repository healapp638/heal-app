import { ScrollView, View } from 'react-native';
import React from 'react';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useTheme } from '@react-navigation/native';
import style from './style';

const Terms = () => {
  const { colors } = useTheme() as any;
  const styles = style(colors);

  const placeholderText =
    'Lorem ipsum dolor sit amet consectetur. Consectetur vitae risus quam vivamus eget id risus malesuada. Vitae luctus pretium magna purus rhoncus. Diam nec maecenas suspendisse neque aliquet posuere. Eu tellus tortor et orci vel sed volutpat id a.\n\nMalesuada risus arcu dignissim molestie tincidunt euismod interdum ante. Orci blandit sollicitudin nunc quam. Varius viverra interdum diam elementum tincidunt sit vestibulum facilisis sapien. Vitae nulla habitasse leo sem mi. Vulputate risus arcu justo sem.\n\nVitae varius placerat vulputate rhoncus vel proin arcu nullam ultricies. Sit sed est viverra dui leo leo turpis velit ultrices. Quisque amet et turpis placerat tincidunt sed fusce ac. Nunc dui dui lacus a tristique augue egestas. Egestas nunc turpis amet elementum bibendum nisl et.\n\nPhasellus vel facilisi adipiscing lacinia. Ipsum consequat eget massa pellentesque bibendum mi ullamcorper quis et. Quisque amet et turpis placerat tincidunt sed fusce ac. Nunc dui dui lacus a tristique augue egestas. Egestas nunc turpis amet elementum bibendum nisl et.\n\nVestibulum donec vitae sed dignissim a euismod duis risus odio. Leo nunc malesuada feugiat pulvinar pellentesque nec turpis. At donec cursus tempor nisl. Porta arcu quisque et pellentesque quam duis id. Ut cursus lectus dignissim tellus consectetur.';

  return (
    <SolidView
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title="Terms of Service" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <SolidText style={styles.text}>{placeholderText}</SolidText>
            <SolidText style={styles.text}>{placeholderText}</SolidText>
          </ScrollView>
        </View>
      }
    />
  );
};

export default Terms;
