import { store } from '../redux/Store/store';
import {
    setOnboardingAnswers,
    setOnboardingCompleted,
    getUserDetail,
} from '../redux/Reducers/userData';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import api from '../api/Manager/manager';
import { endpoints } from '../api/Services/endpoints';
import AppUtils from './appUtils';

// `expo-superwall/compat` eagerly builds a singleton (Superwall._superwall = new Superwall())
// as a static class field, so it registers ~20 native event listeners the instant the
// module is first imported -- not when Superwall is actually used. App.tsx and Welcome.tsx
// both import this file at the top level, and AuthStack statically imports Welcome, so that
// import happens on the app-boot require chain. If the native SuperwallExpo binding isn't
// ready at that instant, it throws synchronously and takes the whole app down before React
// even mounts (the "[runtime not ready]" red screen).
// Loading the SDK lazily on first use, behind a try/catch, means a broken/unready Superwall
// SDK degrades to a graceful fallback instead of crashing the entire app.
const loadSuperwall = () => import('expo-superwall/compat');

// Initialize Superwall SDK (Call this once in your App.tsx)
export const initSuperwall = async (apiKey: string) => {
    try {
        const { default: Superwall } = await loadSuperwall();
        await Superwall.configure({ apiKey });
        console.log('Superwall SDK Initialized');
    } catch (error) {
        console.error('Superwall Initialization Error:', error);
    }
};

// Mirrors CreatingSpace.tsx's `handleContinue` -- the last step of the native
// onboarding flow that Superwall's placement now replaces. Whatever brought the
// Superwall placement to an end (purchase, dismiss, skip, or a failure to even
// show it), the app should land exactly where the native flow always did:
// - already-authenticated users (mid-flow re-onboarding) complete onboarding on
//   the backend and go to the premium offer screen.
// - everyone else goes to AccessScreen (sign in / sign up / continue with
//   Apple/Google), never straight to a specific auth screen.
const finishOnboarding = async (navigation: any) => {
    store.dispatch(setOnboardingCompleted(true));

    const state = store.getState().userData as any;
    const token = state?.token;
    const answers = state?.onboarding?.answers;
    const appLanguage = state?.appLanguage;

    if (token) {
        try {
            const response: any = await api.post(endpoints.complete_onboarding, {
                language: AppUtils.getLanguageCode(appLanguage) || 'en',
                fullName: answers?.fullName || '',
                goalStartWith: answers?.goalStartWith || '',
                timeYouCommit: answers?.timeYouCommit || '',
                stopFeelBetter: answers?.stopFeelBetter || '',
                helpFeelBetter: answers?.helpFeelBetter || '',
                likeToFellMore: answers?.likeToFellMore || '',
                feelThatWay: answers?.feelThatWay || '',
                howFellingLately: answers?.howFellingLately || '',
                hearAboutUs: answers?.hearAboutUs || '',
            });
            if (response?.ok) {
                store.dispatch(getUserDetail() as any);
                navigation.navigate(AppRoutes.NonAuthStack, {
                    screen: AppRoutes.Offer,
                    params: { fromCreatingSpace: true },
                });
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        navigation.navigate(AppRoutes.AccessScreen);
    }
};

// Trigger Onboarding Flow Placement
export const startSuperwallOnboarding = async (navigation: any) => {
    try {
        const { default: Superwall, PaywallPresentationHandler } = await loadSuperwall();
        const handler = new PaywallPresentationHandler();

        // 1. Capture user selection from Superwall buttons.
        // The SDK only ever sends `{ name, variables }` on a custom callback (there is
        // no `customAction` field) -- so the paywall's button must be configured with a
        // Custom Action named "set_onboarding_answer" whose variables include `key` and
        // `value`, matching the answer keys in redux/Reducers/userData.tsx's onboarding state.
        handler.onCustomCallback((callback: any) => {
            if (callback?.name === 'set_onboarding_answer' && callback?.variables) {
                const { key, value } = callback.variables;
                if (key) {
                    store.dispatch(setOnboardingAnswers({ [key]: value }));
                }
            }
        });

        // 2. User completes or dismisses the Superwall onboarding flow
        handler.onDismiss(() => {
            finishOnboarding(navigation);
        });

        // 3. Fallback if paywall is skipped or inactive
        handler.onSkip(() => {
            finishOnboarding(navigation);
        });

        await Superwall.shared.register({
            placement: 'onboarding_start',
            handler,
        });
    } catch (error) {
        console.error('Superwall register error:', error);
        finishOnboarding(navigation);
    }
};
