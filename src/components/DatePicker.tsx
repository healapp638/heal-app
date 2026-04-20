import React from "react";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DatePickerProps {
  isVisible: boolean;
  mode: 'date' | 'time' | 'datetime';
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  selectedDate: Date;
  maxDate?: Date;
  minDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  isVisible,
  mode,
  onConfirm,
  onCancel,
  selectedDate,
  maxDate,
  minDate,
}) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      onConfirm={onConfirm}
      onCancel={onCancel}
      locale="en-US"
      date={selectedDate}
      maximumDate={maxDate}
      minimumDate={minDate}
    />
  );
}

export default DatePicker;
