import AppRoutes from '../../../routes/RouteKeys/appRoutes';

const ONBOARDING_ROUTE_SEQUENCE = [
  AppRoutes.GetStarted,
  AppRoutes.HearAboutUs,
  AppRoutes.BringYouHere,
  AppRoutes.FeelingsLately,
  AppRoutes.FeelMore,
  AppRoutes.TimeCommitment,
  AppRoutes.ReadyToStart,
  AppRoutes.RightPlace,
  AppRoutes.PrivacyMatters,
  AppRoutes.Warning,
  AppRoutes.CreatingSpace,
];

export const RESUMABLE_ONBOARDING_ROUTES = [
  ...ONBOARDING_ROUTE_SEQUENCE,
];

export const isOnboardingAnswersComplete = (answers: any) => {
  if (!answers) {
    return false;
  }

  const requiredTextFields = [
    'hearAboutUs',
    'bringYouHere',
    'feelingsLately',
    'feelMore',
    'timeCommitment',
    'readyToStart',
  ];

  const hasAllTextAnswers = requiredTextFields.every(key => {
    const value = answers[key];
    return typeof value === 'string' && value.trim().length > 0;
  });

  return hasAllTextAnswers && answers.privacyAccepted === true;
};

export const getResumeStackRoutes = (currentScreen: string) => {
  const screenIndex = ONBOARDING_ROUTE_SEQUENCE.indexOf(currentScreen);

  if (screenIndex === -1) {
    return [];
  }

  return [
    AppRoutes.Welcome,
    ...ONBOARDING_ROUTE_SEQUENCE.slice(0, screenIndex + 1),
  ];
};
