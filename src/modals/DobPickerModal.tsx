import React, { useRef, useContext, useEffect } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { LocalizationContext } from '../localization/localization';
import SolidBtn from '../components/SolidBtn';

export type DobDateParts = {
  month: string;
  day: string;
  year: string;
};

type Props = {
  visible: boolean;
  date: DobDateParts;
  setDate: (
    date: DobDateParts | ((prev: DobDateParts) => DobDateParts),
  ) => void;
  setIsDobSelected: (value: boolean) => void;
  onClose: () => void;
  title?: string;
  note?: string;
  confirmLabel?: string;
};

const YEARS = Array.from({ length: 100 }, (_, i) =>
  (new Date().getFullYear() - i).toString(),
);
const DAYS = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, '0'),
);
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const DobPickerModal: React.FC<Props> = ({
  visible,
  date,
  setDate,
  setIsDobSelected,
  onClose,
  title,
  note,
  confirmLabel,
}) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;

  const MONTHS = [
    localization.appkeys?.monthJan,
    localization.appkeys?.monthFeb,
    localization.appkeys?.monthMar,
    localization.appkeys?.monthApr,
    localization.appkeys?.monthMay,
    localization.appkeys?.monthJun,
    localization.appkeys?.monthJul,
    localization.appkeys?.monthAug,
    localization.appkeys?.monthSep,
    localization.appkeys?.monthOct,
    localization.appkeys?.monthNov,
    localization.appkeys?.monthDec,
  ];

  const modalTitle = title || localization.appkeys?.selectDob;
  const modalNote = note || localization.appkeys?.minAgeNote;
  const modalConfirm = confirmLabel || localization.appkeys?.confirm;
  const styles = style(colors);
  const monthRef = useRef<ScrollView>(null);
  const dayRef = useRef<ScrollView>(null);
  const yearRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      // Use a small timeout to ensure the ScrollView is mounted and layout is ready
      setTimeout(() => {
        const mIndex = Math.max(0, MONTHS.indexOf(date.month));
        const dIndex = Math.max(0, DAYS.indexOf(date.day));
        const yIndex = Math.max(0, YEARS.indexOf(date.year));

        monthRef.current?.scrollTo({
          y: mIndex * ITEM_HEIGHT,
          animated: false,
        });
        dayRef.current?.scrollTo({
          y: dIndex * ITEM_HEIGHT,
          animated: false,
        });
        yearRef.current?.scrollTo({
          y: yIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, [visible]);

  const renderDrumPicker = (
    data: string[],
    selectedValue: string,
    onSelect: (val: string) => void,
    ref: React.RefObject<ScrollView | null>,
    flexVal: number,
  ) => {
    const paddedData = ['', '', ...data, '', ''];
    const rawIndex = data.indexOf(selectedValue);
    const selectedIndex = Math.max(0, rawIndex);

    const handleScrollEnd = (e: any) => {
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      onSelect(data[clamped]);
    };

    return (
      <View style={[styles.column, { flex: flexVal }]}>
        <ScrollView
          ref={ref}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          snapToAlignment="center"
          removeClippedSubviews={false}
        >
          {paddedData.map((item, i) => {
            const isSelected =
              item === selectedValue ||
              (item && selectedValue?.startsWith(item) && item.length === 2);
            return (
              <View key={`${item}-${i}`} style={styles.item}>
                <SolidText
                  style={[
                    styles.itemText,
                    isSelected && styles.itemTextSelected,
                    isSelected && { color: colors.white },
                  ]}
                >
                  {item}
                </SolidText>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.dobModalCard}>
          <View style={styles.dobModalHeader}>
            <View style={{ width: 24 }} />
            <SolidText style={styles.modalTitle}>{modalTitle}</SolidText>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={images.cross}
                style={[styles.closeIcon]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerWrapper}>
            <View style={styles.selectionOverlay} pointerEvents="none">
              <View
                style={[
                  styles.selectionBlock,
                  {
                    backgroundColor: colors.primary,
                    flex: 2.5,
                    borderRadius: 10,
                  },
                ]}
              />
              <View style={{ width: wp('2%') }} />
              <View
                style={[
                  styles.selectionBlock,
                  {
                    backgroundColor: colors.primary,
                    flex: 1.8,
                    borderRadius: 10,
                  },
                ]}
              />
              <View style={{ width: wp('2%') }} />
              <View
                style={[
                  styles.selectionBlock,
                  {
                    backgroundColor: colors.primary,
                    flex: 2.5,
                    borderRadius: 10,
                  },
                ]}
              />
            </View>
            {renderDrumPicker(
              MONTHS,
              date.month,
              month => setDate((d: DobDateParts) => ({ ...d, month })),
              monthRef,
              2.5,
            )}
            <View style={{ width: wp('2%') }} />
            {renderDrumPicker(
              DAYS,
              date.day,
              day => setDate((d: DobDateParts) => ({ ...d, day })),
              dayRef,
              1.8,
            )}
            <View style={{ width: wp('2%') }} />
            {renderDrumPicker(
              YEARS,
              date.year,
              year => setDate((d: DobDateParts) => ({ ...d, year })),
              yearRef,
              2.5,
            )}
          </View>

          {modalNote ? (
            <SolidText style={styles.dobNote}>{modalNote}</SolidText>
          ) : null}
          {/* 
          <TouchableOpacity
            style={[styles.dobConfirmButton, { backgroundColor: colors.brown }]}
            onPress={() => {
              setIsDobSelected(true);
              onClose();
            }}
          >
            <SolidText style={styles.dobConfirmText}>{modalConfirm}</SolidText>
          </TouchableOpacity> */}

          <SolidBtn
            onPress={() => {
              setIsDobSelected(true);
              onClose();
            }}
            titleTxt={modalConfirm}
            btnStyle={{ marginBottom: -4 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const style = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: wp('5%'),
    },
    dobModalCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 20,
      width: '100%',
      alignItems: 'center',
    },
    dobModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 30,
    },
    modalTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(20),
      color: colors.brown,
      textAlign: 'center',
      includeFontPadding: false,
      flex: 1,
    },
    closeIcon: {
      width: 24,
      height: 24,
      tintColor: colors.brown,
    },
    pickerWrapper: {
      flexDirection: 'row',
      height: PICKER_HEIGHT,
      overflow: 'hidden',
      alignSelf: 'center',
      width: '100%',
    },
    selectionOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 1,
    },
    selectionBlock: {
      height: ITEM_HEIGHT - 8,
    },
    column: {
      height: PICKER_HEIGHT,
      overflow: 'hidden',
      zIndex: 2,
    },
    item: {
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(18),
      color: colors.primary,
      opacity: 0.4,
      textAlign: 'center',
      includeFontPadding: false,
    },
    itemTextSelected: {
      fontFamily: AppFonts.regular,
      color: colors.white,
      opacity: 1,
      includeFontPadding: false,
    },
    dobNote: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      textAlign: 'center',
      marginTop: 25,
      textDecorationLine: 'underline',
      includeFontPadding: false,
    },
    dobConfirmButton: {
      borderRadius: 100,
      paddingVertical: 16,
      width: '100%',
      marginTop: 30,
      alignItems: 'center',
    },
    dobConfirmText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(18),
      color: colors.white,
      includeFontPadding: false,
    },
  });

export default DobPickerModal;
