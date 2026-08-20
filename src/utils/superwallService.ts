import { store } from '../redux/Store/store';
import {
    setOnboardingAnswers,
    setOnboardingCompleted,
    getUserDetail,
    SetAppLanguage,
} from '../redux/Reducers/userData';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import api from '../api/Manager/manager';
import { endpoints } from '../api/Services/endpoints';
import AppUtils from './appUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../constants/variables';

export const LANGUAGE_MAP: Record<string, string> = {
    english: 'English',
    eng: 'English',
    en: 'English',
    spanish: 'Spanish',
    español: 'Spanish',
    espanol: 'Spanish',
    esp: 'Spanish',
    es: 'Spanish',
    french: 'French',
    français: 'French',
    francais: 'French',
    fra: 'French',
    fr: 'French',
    german: 'German',
    deutsch: 'German',
    deu: 'German',
    de: 'German',
    russian: 'Russian',
    русский: 'Russian',
    rus: 'Russian',
    ru: 'Russian',
    portuguese: 'Portuguese',
    português: 'Portuguese',
    portugues: 'Portuguese',
    por: 'Portuguese',
    pt: 'Portuguese',
    italian: 'Italian',
    italiano: 'Italian',
    ita: 'Italian',
    it: 'Italian',
};

export const applySuperwallLanguage = (rawLanguage: string) => {
    if (!rawLanguage) return;
    const normalized = String(rawLanguage).trim().toLowerCase();
    const matched = LANGUAGE_MAP[normalized] || rawLanguage;
    console.log(`🌐 [SUPERWALL -> NATIVE] Setting App Language: "${rawLanguage}" -> "${matched}"`);
    store.dispatch(SetAppLanguage(matched));
    AsyncStorage.setItem(strings.appLanguage, matched);
};

// `expo-superwall/compat` eagerly builds a singleton (Superwall._superwall = new Superwall())
// as a static class field, so it registers ~20 native event listeners the instant the
// module is first imported -- not when Superwall is actually used. App.tsx and Welcome.tsx
// both import this file at the top level, and AuthStack statically imports Welcome, so that
// import happens on the app-boot require chain. If the native SuperwallExpo binding isn't
// ready at that instant, it throws synchronously and takes the whole app down before React
// even mounts (the "[runtime not ready]" red screen).
// Loading the SDK lazily on first use, behind a try/catch, means a broken/unready Superwall
// SDK degrades to a graceful fallback instead of crashing the entire app.
// Cached dynamic import to pre-warm expo-superwall/compat
let superwallModulePromise: Promise<any> | null = null;
const loadSuperwall = () => {
    if (!superwallModulePromise) {
        superwallModulePromise = import('expo-superwall/compat');
    }
    return superwallModulePromise;
};

// Initialize Superwall SDK (Call this once in your App.tsx)
export const initSuperwall = async (apiKey: string) => {
    try {
        const { default: Superwall, SuperwallOptions, SubscriptionStatus } = await loadSuperwall();
        const options = new SuperwallOptions({
            paywalls: {
                shouldPreload: true,
            },
        });
        await Superwall.configure({ apiKey, options });
        
        // Ensure SDK treats unauthenticated new user as Inactive (unsubscribed)
        // This is critical for matching audience rules like "Show to: unsubscribed users"
        try {
            await Superwall.shared.setSubscriptionStatus(SubscriptionStatus.Inactive);
        } catch (subErr) {
            console.log('Error setting initial subscription status:', subErr);
        }

        // Preload paywalls immediately in background during splash so they appear instantly
        await Superwall.shared.preloadPaywalls(new Set(['onboarding_start']));
        await Superwall.shared.preloadAllPaywalls();
        console.log('✅ Superwall SDK Initialized & Preloaded');
    } catch (error) {
        console.error('Superwall Initialization Error:', error);
    }
};

let isSuperwallPresenting = false;
let didUserExitToAuth = false;

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
    const answers = state?.onboarding?.answers || {};
    const appLanguage = state?.appLanguage;

    console.log('🎉 =======================================================');
    console.log('🎉 [SUPERWALL ONBOARDING COMPLETED - ALL ANSWERS COLLECTED]');
    console.log(JSON.stringify(answers, null, 2));
    console.log('🎉 =======================================================');

    // Only complete onboarding and navigate to Offer if the user actually answered the questions
    const hasOnboardingAnswers = [
        answers?.goalStartWith,
        answers?.timeYouCommit,
        answers?.stopFeelBetter,
        answers?.helpFeelBetter,
        answers?.likeToFellMore,
        answers?.feelThatWay,
        answers?.howFellingLately,
        answers?.hearAboutUs,
    ].some(val => typeof val === 'string' && val.trim().length > 0);

    if (token && hasOnboardingAnswers) {
        console.log('🚨 [SUPERWALL -> NATIVE] finishOnboarding: User authenticated and answers collected. Submitting complete_onboarding and navigating to Offer screen.');
        try {
            await api.post(endpoints.complete_onboarding, {
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
            store.dispatch(getUserDetail() as any);
        } catch (error) {
            console.log('complete_onboarding error:', error);
        } finally {
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: AppRoutes.NonAuthStack,
                        params: {
                            screen: AppRoutes.Offer,
                            params: { fromCreatingSpace: true },
                        },
                    },
                ],
            });
        }
    } else {
        console.log('🚨 [SUPERWALL -> NATIVE] finishOnboarding: Onboarding not completed / unauthenticated. Navigating to AccessScreen.');
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: AppRoutes.AuthStack,
                    params: { screen: AppRoutes.AccessScreen },
                },
            ],
        });
    }
};

// Set custom user attributes in Superwall SDK
export const setSuperwallUserAttributes = async (attributes: Record<string, any>) => {
    try {
        const { default: Superwall } = await loadSuperwall();
        await Superwall.shared.setUserAttributes(attributes);
        console.log('👤 [SUPERWALL DEBUG] setSuperwallUserAttributes SUCCESS:', JSON.stringify(attributes));
    } catch (e) {
        console.log('❌ [SUPERWALL DEBUG] Error setting Superwall user attributes:', e);
    }
};

// Safely dismiss Superwall if currently showing
export const dismissSuperwall = async () => {
    try {
        isSuperwallPresenting = false;
        const { default: Superwall } = await loadSuperwall();
        await Superwall.dismiss();
    } catch (e) {
        console.log('Error dismissing Superwall:', e);
    }
};

// Trigger Onboarding Flow Placement
export const startSuperwallOnboarding = async (navigation: any, onFallback?: () => void) => {
    if (isSuperwallPresenting) {
        console.log('Superwall onboarding already presenting/registering, skipping duplicate call');
        return;
    }
    isSuperwallPresenting = true;
    didUserExitToAuth = false;
    try {
        const { default: Superwall, PaywallPresentationHandler, SubscriptionStatus } = await loadSuperwall();
        
        // Reset device session cache so past test runs don't cause audience limits/skips
        try {
            await Superwall.shared.reset();
            await Superwall.shared.setSubscriptionStatus(SubscriptionStatus.Inactive);

            const state = store.getState().userData as any;
            const hasAuthToken = !!state?.token || !!state?.auth;
            console.log('🔍 [SUPERWALL DEBUG] Checking user state before register:');
            console.log('   - Redux Token:', state?.token ? `${state?.token?.substring(0, 15)}...` : 'NULL');
            console.log('   - Redux Auth:', state?.auth);
            console.log('   - hasAuthToken computed:', hasAuthToken);

            if (hasAuthToken) {
                await Superwall.shared.setUserAttributes({ has_signed_up: true });
                console.log('👤 [SUPERWALL DEBUG] Set user attribute: { has_signed_up: true }');
            } else {
                console.log('👤 [SUPERWALL DEBUG] User is Guest (no token/auth). Attributes not set.');
            }
        } catch (e) {
            console.log('Error resetting Superwall session:', e);
        }

        const handler = new PaywallPresentationHandler();

        handler.onPresent((info: any) => {
            console.log('🎨 [SUPERWALL DEBUG] Paywall Presented Successfully!');
            console.log('   - Paywall Name/Identifier:', info?.name || info?.identifier || JSON.stringify(info));
        });

        // 1. Capture user selection from Superwall buttons.
        // The SDK only ever sends `{ name, variables }` on a custom callback (there is
        // no `customAction` field) -- so the paywall's button must be configured with a
        // Custom Action named "set_onboarding_answer" whose variables include `key` and
        // `value`, matching the answer keys in redux/Reducers/userData.tsx's onboarding state.
        handler.onCustomCallback((callback: any) => {
            console.log('🔔 [Superwall Callback]:', JSON.stringify(callback, null, 2));

            // Universal Language Detection from any variables or action
            if (callback?.variables && typeof callback.variables === 'object') {
                for (const [k, v] of Object.entries(callback.variables)) {
                    if (typeof v === 'string') {
                        const trimmedLower = v.trim().toLowerCase();
                        if (LANGUAGE_MAP[trimmedLower]) {
                            applySuperwallLanguage(v);
                            break;
                        }
                    }
                    if (typeof k === 'string' && (k.toLowerCase().includes('lang') || k.toLowerCase().includes('locale'))) {
                        if (typeof v === 'string') {
                            applySuperwallLanguage(v);
                            break;
                        }
                    }
                }
            }

            // Language Selection Callbacks
            if (
                callback?.name === 'set_language' ||
                callback?.name === 'select_language' ||
                callback?.name === 'change_language' ||
                callback?.name === 'language'
            ) {
                const lang =
                    callback.variables?.language ||
                    callback.variables?.value ||
                    callback.variables?.lang ||
                    callback.variables?.selected_language ||
                    callback.variables?.name;
                if (lang) {
                    applySuperwallLanguage(lang);
                }
            } else if (
                callback?.name === 'set_name' ||
                callback?.name === 'set_username' ||
                callback?.name === 'set_fullname' ||
                callback?.name === 'save_name' ||
                callback?.name === 'user_name' ||
                callback?.name === 'username' ||
                callback?.name === 'name' ||
                callback?.name === 'fullname'
            ) {
                const nameVal =
                    (typeof callback.variables === 'string' ? callback.variables : null) ||
                    callback.variables?.fullName ||
                    callback.variables?.userName ||
                    callback.variables?.name ||
                    callback.variables?.value ||
                    callback.variables?.firstName;
                if (nameVal) {
                    console.log(`✅ Onboarding Answer Stored (Name): [fullName] = "${nameVal}"`);
                    store.dispatch(setOnboardingAnswers({ fullName: nameVal }));
                }
            } else if (callback?.name === 'set_onboarding_answer' && callback?.variables) {
                const vars = callback.variables;
                if (typeof vars === 'object') {
                    if (vars.key && vars.value !== undefined) {
                        const cleanKey = String(vars.key).replace(/^state\./, '');
                        if (cleanKey.toLowerCase().includes('lang')) {
                            applySuperwallLanguage(vars.value);
                        } else {
                            const lower = cleanKey.toLowerCase();
                            const finalKey =
                                lower === 'username' || lower === 'name' || lower === 'fullname' || lower === 'firstname'
                                    ? 'fullName'
                                    : cleanKey;
                            console.log(`✅ Onboarding Answer Stored: [${finalKey}] = "${vars.value}"`);
                            store.dispatch(setOnboardingAnswers({ [finalKey]: vars.value }));
                        }
                    } else {
                        const payload: Record<string, any> = {};
                        const selectedMoods: string[] = [];
                        const selectedFeelThatWay: string[] = [];
                        const selectedFeelMore: string[] = [];

                        const MOOD_MAP: Record<string, string> = {
                            moodcalm: 'Calm',
                            calm: 'Calm',
                            moodsad: 'Sad',
                            sad: 'Sad',
                            moodhappy: 'Happy',
                            happy: 'Happy',
                            moodsorrow: 'Sorrow',
                            sorrow: 'Sorrow',
                            moodthoughtful: 'Thoughtful',
                            thoughtful: 'Thoughtful',
                            moodhopeful: 'Hopeful',
                            hopeful: 'Hopeful',
                        };

                        const TOPIC_MAP: Record<string, string> = {
                            topicromantic: 'Romantic relationships',
                            romantic: 'Romantic relationships',
                            romanticrelationships: 'Romantic relationships',
                            topicfamily: 'Family',
                            family: 'Family',
                            topicfriendship: 'Friendship',
                            friendship: 'Friendship',
                            topicloneliness: 'Loneliness',
                            loneliness: 'Loneliness',
                            topicselfconfident: 'Self Confident',
                            selfconfident: 'Self Confident',
                            topictalk: 'Just need to talk',
                            topicneedtotalk: 'Just need to talk',
                            topicjustneedtotalk: 'Just need to talk',
                            needtotalk: 'Just need to talk',
                            justneedtotalk: 'Just need to talk',
                            talk: 'Just need to talk',
                        };

                        const FEEL_MORE_MAP: Record<string, string> = {
                            feelpeaceofmind: 'Peace of mind',
                            peaceofmind: 'Peace of mind',
                            feelpeace: 'Peace of mind',
                            peace: 'Peace of mind',
                            topicpeace: 'Peace of mind',
                            topicpeaceofmind: 'Peace of mind',
                            feelconfidence: 'Confidence',
                            confidence: 'Confidence',
                            topicconfidence: 'Confidence',
                            feelemotionalstrength: 'Emotional strength',
                            emotionalstrength: 'Emotional strength',
                            feelstrength: 'Emotional strength',
                            strength: 'Emotional strength',
                            topicstrength: 'Emotional strength',
                            topictopstrength: 'Emotional strength',
                            feelclarity: 'Clarity about my life',
                            clarity: 'Clarity about my life',
                            clarityaboutmylife: 'Clarity about my life',
                            topicclarity: 'Clarity about my life',
                            feelbalance: 'Balance',
                            balance: 'Balance',
                            topicbalance: 'Balance',
                            feelmotivation: 'Motivation',
                            motivation: 'Motivation',
                            topicmotivation: 'Motivation',
                        };

                        const HELP_BETTER_MAP: Record<string, string> = {
                            feelgoingoutside: 'Going Outside',
                            helpgoingoutside: 'Going Outside',
                            goingoutside: 'Going Outside',
                            feeltherapy: 'Therapy',
                            helptherapy: 'Therapy',
                            therapy: 'Therapy',
                            feeljournaling: 'Journaling',
                            helpjournaling: 'Journaling',
                            journaling: 'Journaling',
                            feelnature: 'Spending time in nature',
                            helpnature: 'Spending time in nature',
                            nature: 'Spending time in nature',
                            spendingtimeinnature: 'Spending time in nature',
                            feeltalking: 'Talking to someone',
                            helptalking: 'Talking to someone',
                            talking: 'Talking to someone',
                            talkingtosomeone: 'Talking to someone',
                            feellistening: 'Listening to music',
                            helpmusic: 'Listening to music',
                            feelmusic: 'Listening to music',
                            music: 'Listening to music',
                            listeningtomusic: 'Listening to music',
                            feelother: 'Other',
                            helpother: 'Other',
                            other: 'Other',
                        };

                        const STOP_BETTER_MAP: Record<string, string> = {
                            feeloverthinkp9: 'I overthink everything',
                            overthinkp9: 'I overthink everything',
                            stopoverthink: 'I overthink everything',
                            stopoverthinking: 'I overthink everything',
                            overthink: 'I overthink everything',
                            overthinking: 'I overthink everything',
                            feeloverthink: 'I overthink everything',
                            feellosemotivationp9: 'I lose motivation quickly',
                            losemotivationp9: 'I lose motivation quickly',
                            feellosemotivation: 'I lose motivation quickly',
                            stopmotivation: 'I lose motivation quickly',
                            losemotivation: 'I lose motivation quickly',
                            feelmotivationloss: 'I lose motivation quickly',
                            feelstuckinheadp9: 'I stay stuck in my head',
                            stuckinheadp9: 'I stay stuck in my head',
                            feelstuck: 'I stay stuck in my head',
                            stopstuck: 'I stay stuck in my head',
                            stuckinmyhead: 'I stay stuck in my head',
                            stuck: 'I stay stuck in my head',
                            feelisolatemyselfp9: 'I isolate myself',
                            isolatemyselfp9: 'I isolate myself',
                            feelisolate: 'I isolate myself',
                            stopisolate: 'I isolate myself',
                            isolatemyself: 'I isolate myself',
                            isolate: 'I isolate myself',
                            feeldontknowp9: "I don't know what helps",
                            dontknowp9: "I don't know what helps",
                            feeldontknow: "I don't know what helps",
                            stopdontknow: "I don't know what helps",
                            dontknowwhathelps: "I don't know what helps",
                            dontknow: "I don't know what helps",
                            feelunhealthypatternsp9: 'I repeat unhealthy patterns',
                            unhealthypatternsp9: 'I repeat unhealthy patterns',
                            feelunhealthy: 'I repeat unhealthy patterns',
                            stopunhealthy: 'I repeat unhealthy patterns',
                            unhealthypatterns: 'I repeat unhealthy patterns',
                            unhealthy: 'I repeat unhealthy patterns',
                        };

                        const TIME_COMMIT_MAP: Record<string, string> = {
                            timefewminutesp11: 'A few minutes',
                            timefewminutes: 'A few minutes',
                            fewminutes: 'A few minutes',
                            time10minutesp11: 'Around 10 minutes',
                            time10minutes: 'Around 10 minutes',
                            around10minutes: 'Around 10 minutes',
                            time20plusp11: '20 minutes or more',
                            time20plus: '20 minutes or more',
                            time20minutes: '20 minutes or more',
                            '20minutesormore': '20 minutes or more',
                            timewhenneededp11: 'Only when I need it',
                            timewhenneeded: 'Only when I need it',
                            whenneeded: 'Only when I need it',
                            onlywhenineedit: 'Only when I need it',
                        };

                        const GOAL_START_MAP: Record<string, string> = {
                            streak3daysp12: '3 days in a row',
                            streak3days: '3 days in a row',
                            goal3daysp12: '3 days in a row',
                            goal3days: '3 days in a row',
                            '3days': '3 days in a row',
                            '3daysinarow': '3 days in a row',
                            opt3days: '3 days in a row',
                            streak7daysp12: '7 days in a row',
                            streak7days: '7 days in a row',
                            goal7daysp12: '7 days in a row',
                            goal7days: '7 days in a row',
                            '7days': '7 days in a row',
                            '7daysinarow': '7 days in a row',
                            opt7days: '7 days in a row',
                            streak21daysp12: '21 days in a row',
                            streak21days: '21 days in a row',
                            goal21daysp12: '21 days in a row',
                            goal21days: '21 days in a row',
                            '21days': '21 days in a row',
                            '21daysinarow': '21 days in a row',
                            opt21days: '21 days in a row',
                        };

                        const selectedHelpBetter: string[] = [];
                        const selectedStopBetter: string[] = [];
                        let selectedTimeCommit: string | null = null;
                        let selectedGoalStart: string | null = null;

                        Object.entries(vars).forEach(([k, v]) => {
                            const cleanKey = k.replace(/^(state|user|user_attributes|attributes)\./i, '');
                            const lowerKey = cleanKey.toLowerCase();
                            const isSelected = v === true || v === 'on' || v === 'true' || v === '1';

                            if (MOOD_MAP[lowerKey]) {
                                if (isSelected) {
                                    selectedMoods.push(MOOD_MAP[lowerKey]);
                                }
                            } else if (TOPIC_MAP[lowerKey]) {
                                if (isSelected) {
                                    selectedFeelThatWay.push(TOPIC_MAP[lowerKey]);
                                }
                            } else if (FEEL_MORE_MAP[lowerKey]) {
                                if (isSelected) {
                                    selectedFeelMore.push(FEEL_MORE_MAP[lowerKey]);
                                }
                            } else if (HELP_BETTER_MAP[lowerKey]) {
                                if (isSelected) {
                                    selectedHelpBetter.push(HELP_BETTER_MAP[lowerKey]);
                                }
                            } else if (STOP_BETTER_MAP[lowerKey]) {
                                if (isSelected) {
                                    selectedStopBetter.push(STOP_BETTER_MAP[lowerKey]);
                                }
                            } else if (TIME_COMMIT_MAP[lowerKey]) {
                                if (isSelected) {
                                    selectedTimeCommit = TIME_COMMIT_MAP[lowerKey];
                                }
                            } else if (GOAL_START_MAP[lowerKey]) {
                                if (isSelected) {
                                    selectedGoalStart = GOAL_START_MAP[lowerKey];
                                }
                            } else if (
                                lowerKey === 'username' ||
                                lowerKey === 'name' ||
                                lowerKey === 'fullname' ||
                                lowerKey === 'firstname' ||
                                lowerKey.includes('.value') ||
                                lowerKey.endsWith('value') ||
                                lowerKey.startsWith('node.')
                            ) {
                                payload['fullName'] = v;
                                console.log(`✅ Onboarding Answer Stored: [fullName] = "${v}"`);
                            } else if (lowerKey === 'privacyaccepted') {
                                payload['privacyAccepted'] = isSelected;
                                console.log(`✅ Onboarding Answer Stored: [privacyAccepted] = ${isSelected}`);
                            } else {
                                payload[cleanKey] = v;
                                console.log(`✅ Onboarding Answer Stored: [${cleanKey}] = "${v}"`);
                            }
                        });

                        if (selectedMoods.length > 0) {
                            const combined = selectedMoods.join(', ');
                            payload['howFellingLately'] = combined;
                            console.log(`✅ Onboarding Answer Stored (Multi-select Moods): [howFellingLately] = "${combined}" (Array: [${selectedMoods.map(m => `"${m}"`).join(', ')}])`);
                        }

                        if (selectedFeelThatWay.length > 0) {
                            const combined = selectedFeelThatWay.join(', ');
                            payload['feelThatWay'] = combined;
                            console.log(`✅ Onboarding Answer Stored (Multi-select Topics): [feelThatWay] = "${combined}" (Array: [${selectedFeelThatWay.map(m => `"${m}"`).join(', ')}])`);
                        }

                        if (selectedFeelMore.length > 0) {
                            const combined = selectedFeelMore.join(', ');
                            payload['likeToFellMore'] = combined;
                            console.log(`✅ Onboarding Answer Stored (Multi-select Goals): [likeToFellMore] = "${combined}" (Array: [${selectedFeelMore.map(m => `"${m}"`).join(', ')}])`);
                        }

                        if (selectedHelpBetter.length > 0) {
                            const combined = selectedHelpBetter.join(', ');
                            payload['helpFeelBetter'] = combined;
                            console.log(`✅ Onboarding Answer Stored (Multi-select Helps): [helpFeelBetter] = "${combined}" (Array: [${selectedHelpBetter.map(m => `"${m}"`).join(', ')}])`);
                        }

                        if (selectedStopBetter.length > 0) {
                            const combined = selectedStopBetter.join(', ');
                            payload['stopFeelBetter'] = combined;
                            console.log(`✅ Onboarding Answer Stored (Multi-select Obstacles): [stopFeelBetter] = "${combined}" (Array: [${selectedStopBetter.map(m => `"${m}"`).join(', ')}])`);
                        }

                        if (selectedTimeCommit) {
                            payload['timeYouCommit'] = selectedTimeCommit;
                            console.log(`✅ Onboarding Answer Stored (Time Commitment): [timeYouCommit] = "${selectedTimeCommit}"`);
                        }

                        if (selectedGoalStart) {
                            payload['goalStartWith'] = selectedGoalStart;
                            console.log(`✅ Onboarding Answer Stored (Start Goal): [goalStartWith] = "${selectedGoalStart}"`);
                        }

                        if (vars.language || vars.selected_language || vars.appLanguage || vars.lang) {
                            const lang = vars.language || vars.selected_language || vars.appLanguage || vars.lang;
                            applySuperwallLanguage(lang);
                        }

                        if (Object.keys(payload).length > 0) {
                            store.dispatch(setOnboardingAnswers(payload));
                        }
                    }
                }
            } else {
                const normalizedCb = (callback?.name || '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '');

                const isAuthCb =
                    normalizedCb.includes('signin') ||
                    normalizedCb.includes('signup') ||
                    normalizedCb.includes('login') ||
                    normalizedCb.includes('access') ||
                    normalizedCb.includes('auth') ||
                    normalizedCb.includes('createaccount') ||
                    normalizedCb.includes('register');

                if (isAuthCb) {
                    console.log(`🚨 [SUPERWALL -> NATIVE] Custom auth callback "${callback?.name}" triggered. Navigating to native AccessScreen.`);
                    didUserExitToAuth = true;
                    isSuperwallPresenting = false;
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: AppRoutes.AuthStack,
                                params: { screen: AppRoutes.AccessScreen },
                            },
                        ],
                    });
                }
            }
            return { status: 'success' };
        });

        // 2. User completes the Superwall onboarding flow (final dismiss / purchase)
        handler.onDismiss(() => {
            console.log('🎉 [SUPERWALL -> NATIVE] handler.onDismiss: Superwall paywall was completed/dismissed by user.');
            isSuperwallPresenting = false;
            if (didUserExitToAuth) {
                console.log('ℹ️ [SUPERWALL] User exited to Sign In / Auth. Skipping finishOnboarding.');
                didUserExitToAuth = false;
                return;
            }
            finishOnboarding(navigation);
        });

        // 3. If paywall is skipped by SDK (e.g. audience mismatch, holdout)
        handler.onSkip((reason: any) => {
            console.warn('⚠️ [SUPERWALL] handler.onSkip: Placement was SKIPPED by Superwall. Reason:', JSON.stringify(reason, null, 2));
            isSuperwallPresenting = false;
            onFallback?.();
        });

        handler.onError((error: any) => {
            console.error('❌ [SUPERWALL] handler.onError: Superwall presentation error:', error);
            isSuperwallPresenting = false;
            onFallback?.();
        });

        const state = store.getState().userData as any;
        const hasAuthToken = !!state?.token || !!state?.auth;

        console.log('🚀 [SUPERWALL DEBUG] Calling Superwall.shared.register:');
        console.log('   - Placement: "onboarding_start"');
        console.log('   - Params passed: ', JSON.stringify({ has_signed_up: hasAuthToken }));
        console.log('   - User Attributes in Superwall: { has_signed_up: ', hasAuthToken, '}');

        await Superwall.shared.register({
            placement: 'onboarding_start',
            params: { has_signed_up: hasAuthToken },
            handler,
        });
    } catch (error) {
        console.error('❌ [SUPERWALL DEBUG] Exception during Superwall register:', error);
        isSuperwallPresenting = false;
        onFallback?.();
    }
};
