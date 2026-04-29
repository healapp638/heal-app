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

  // Still use scrollTo for initial open as contentOffset can be unreliable on Android re-renders
  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        const mIndex = Math.max(0, MONTHS.indexOf(date.month));
        const dIndex = Math.max(0, DAYS.indexOf(date.day));
        const yIndex = Math.max(0, YEARS.indexOf(date.year));

        monthRef.current?.scrollTo({
          y: mIndex * ITEM_HEIGHT,
          animated: false,
        });
        dayRef.current?.scrollTo({ y: dIndex * ITEM_HEIGHT, animated: false });
        yearRef.current?.scrollTo({ y: yIndex * ITEM_HEIGHT, animated: false });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const renderDrumPicker = (
    data: string[],
    selectedValue: string,
    onSelect: (val: string) => void,
    ref: React.RefObject<ScrollView | null>,
    colWidth: number,
  ) => {
    const paddedData = ['', '', ...data, '', ''];
    const selectedIndex = Math.max(0, data.indexOf(selectedValue));

    const handleScrollEnd = (e: any) => {
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      const newValue = data[clamped];
      if (newValue && newValue !== selectedValue) {
        onSelect(newValue);
      }
    };

    return (
      <View style={[styles.column, { width: colWidth }]}>
        <ScrollView
          ref={ref}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToOffsets={data.map((_, i) => i * ITEM_HEIGHT)}
          decelerationRate="fast"
          contentOffset={
            Platform.OS === 'ios'
              ? { x: 0, y: selectedIndex * ITEM_HEIGHT }
              : undefined
          }
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          scrollEventThrottle={16}
          snapToAlignment="start"
          nestedScrollEnabled={true}
          removeClippedSubviews={false}
        >
          {paddedData.map((item, i) => {
            const isSelected = item === selectedValue;
            return (
              <View key={`${item}-${i}`} style={styles.item}>
                <SolidText
                  style={[
                    styles.itemText,
                    isSelected && styles.itemTextSelected,
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
            <SolidText style={styles.modalTitle}>{modalTitle}</SolidText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
                style={{
                  width: wp('30%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={styles.pillInner} />
              </View>
              <View style={{ width: wp('2%') }} />
              <View
                style={{
                  width: wp('16%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={styles.pillInner} />
              </View>
              <View style={{ width: wp('2%') }} />
              <View
                style={{
                  width: wp('22%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={styles.pillInner} />
              </View>
            </View>
            {renderDrumPicker(
              MONTHS,
              date.month,
              month => setDate((d: any) => ({ ...d, month })),
              monthRef,
              wp('30%'),
            )}
            <View style={{ width: wp('2%') }} />
            {renderDrumPicker(
              DAYS,
              date.day,
              day => setDate((d: any) => ({ ...d, day })),
              dayRef,
              wp('16%'),
            )}
            <View style={{ width: wp('2%') }} />
            {renderDrumPicker(
              YEARS,
              date.year,
              year => setDate((d: any) => ({ ...d, year })),
              yearRef,
              wp('22%'),
            )}
          </View>

          {modalNote ? (
            <SolidText style={styles.dobNote}>{modalNote}</SolidText>
          ) : null}

          <TouchableOpacity
            style={styles.dobConfirmButton}
            onPress={() => {
              setIsDobSelected(true);
              onClose();
            }}
          >
            <SolidText style={styles.dobConfirmText}>{modalConfirm}</SolidText>
          </TouchableOpacity>
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
      padding: 24,
      width: '100%',
      alignItems: 'center',
    },
    dobModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 16,
    },
    closeButton: {
      padding: 4,
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
      width: wp('72%'),
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
    pillInner: {
      height: ITEM_HEIGHT - 12,
      width: '80%',
      backgroundColor: colors.primary,
      borderRadius: 12,
    },
    column: {
      height: PICKER_HEIGHT,
      overflow: 'hidden',
      zIndex: 2,
      alignItems: 'center',
    },
    item: {
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    itemText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      opacity: 0.4,
      textAlign: 'center',
      textAlignVertical: 'center',
      lineHeight: ITEM_HEIGHT,
      includeFontPadding: false,
    },
    itemTextSelected: {
      fontFamily: AppFonts.semiBold,
      color: colors.white,
      opacity: 1,
      includeFontPadding: false,
    },
    dobNote: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      textAlign: 'center',
      marginTop: 12,
      textDecorationLine: 'underline',
      includeFontPadding: false,
    },
    dobConfirmButton: {
      backgroundColor: colors.primary,
      borderRadius: 30,
      paddingVertical: 12,
      paddingHorizontal: 40,
      marginTop: 16,
      alignItems: 'center',
    },
    dobConfirmText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: colors.white,
      includeFontPadding: false,
    },
  });

export default DobPickerModal;
