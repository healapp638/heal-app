export const monthToNumber: { [key: string]: string } = {
  'January': '01',
  'February': '02',
  'March': '03',
  'April': '04',
  'May': '05',
  'June': '06',
  'July': '07',
  'August': '08',
  'September': '09',
  'October': '10',
  'November': '11',
  'December': '12',
};

export const getLocalizedMonths = (localization: any) => [
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

export const getLocalizedMonthName = (monthName: string, localization: any) => {
  const monthMap: { [key: string]: string } = {
    'January': localization.appkeys?.monthJan,
    'February': localization.appkeys?.monthFeb,
    'March': localization.appkeys?.monthMar,
    'April': localization.appkeys?.monthApr,
    'May': localization.appkeys?.monthMay,
    'June': localization.appkeys?.monthJun,
    'July': localization.appkeys?.monthJul,
    'August': localization.appkeys?.monthAug,
    'September': localization.appkeys?.monthSep,
    'October': localization.appkeys?.monthOct,
    'November': localization.appkeys?.monthNov,
    'December': localization.appkeys?.monthDec,
  };
  return monthMap[monthName] || monthName;
};
