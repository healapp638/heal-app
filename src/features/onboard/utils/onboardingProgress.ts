import AppRoutes from '../../../routes/RouteKeys/appRoutes';

export const ONBOARDING_ROUTE_SEQUENCE = [
  AppRoutes.GetStarted,
  AppRoutes.HearAboutUs,
  AppRoutes.FeelingsLately,
  AppRoutes.BringYouHere,
  AppRoutes.FeelMore,
  AppRoutes.RightPlace,
  AppRoutes.EnterName,
  AppRoutes.HelpsFeelBetter,
  AppRoutes.StopsFeelingBetter,
  AppRoutes.UnderstandYourself,
  AppRoutes.TimeCommitment,
  AppRoutes.StartGoal,
  AppRoutes.StreakGrounded,
  AppRoutes.PrivacyMatters,
  AppRoutes.Warning,
  AppRoutes.CreatingSpace,
];

export const RESUMABLE_ONBOARDING_ROUTES = [
  ...ONBOARDING_ROUTE_SEQUENCE,
];

export const PROGRESS_BAR_SCREENS = [
  AppRoutes.FeelingsLately,
  AppRoutes.BringYouHere,
  AppRoutes.FeelMore,
  AppRoutes.HelpsFeelBetter,
  AppRoutes.StopsFeelingBetter,
  AppRoutes.TimeCommitment,
  AppRoutes.StartGoal,
];

export const isOnboardingAnswersComplete = (answers: any) => {
  if (!answers) {
    return false;
  }

  const requiredTextFields = [
    'hearAboutUs',
    'feelThatWay',
    'howFellingLately',
    'likeToFellMore',
    'timeYouCommit',
    'goalStartWith',
    'readyToStart',
  ];

  const hasAllTextAnswers = requiredTextFields.every(key => {
    const value = answers[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
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
