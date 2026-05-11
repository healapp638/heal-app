"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserChallengesWeekly = exports.generateUserChallengesDaily = void 0;
const openai_1 = __importDefault(require("openai"));
const app_constant_1 = require("../constants/app.constant");
const openai = new openai_1.default({
    apiKey: app_constant_1.APP.OPENAI_API_KEY,
});
const generateUserChallengesDaily = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const prompt = `
                        You are an emotional wellness challenge generator for a self-care mobile app.

                        Generate personalized challenges for a user based on onboarding answers.

                        USER DATA:
                        - What brings user here: ${payload.bringsYouHere}
                        - How user feeling lately: ${payload.howFellingLately}
                        - What user wants to feel more: ${payload.likeToFellMore}
                        - Time user can commit: ${payload.timeYouCommit}
                        - Ready to start level: ${payload.startShowingOfYourSelf}

                        IMPORTANT RULES:

                        1. Generate TOTAL 3 challenges:

                        2. DAILY challenges:
                        - Focus on personal well-being
                        - Focus on self-care
                        - Focus on emotional healing
                        - Focus on mindfulness
                        - Small achievable habits
                        - Must feel easy and comforting
                        - points must be 10


                        3. Every challenge must contain:
                        - challenge_type
                        - title
                        - description
                        - points
                        - concept_title
                        - concept_description
                        - about_challenge
                        - exercises

                        4. Each challenge must contain EXACTLY 5 exercises.

                        5. Every exercise must contain:
                        - title
                        - step_number

                        6. step_number must start from 1 to 5

                        7. Exercises must be:
                        - short
                        - actionable
                        - easy to understand
                        - emotionally supportive

                        8. Generate content in ALL languages:
                        en, zh, hi, es, fr, de, ru, pt, it, ro

                        9. Return ONLY valid JSON.

                        10. DO NOT return markdown.

                        12. Keep tone:
                        - warm
                        - emotionally safe
                        - supportive
                        - simple
                        - non-medical

                        13.Some Daily Challenge Ideas
                         - Go for a 5-minute walk
                         - Drink enough water today
                         - Listen to a calming song
                         - Stretch for 5 minutes
                         - Write down your feelings
                         - Read a few pages of a book
                         - Stay off social media for 30 minutes
                         - Say one positive thing about yourself
                         - Clean a small space around you
                         - Spend a moment outside
                         - Take 10 deep breaths
                         - Make yourself a comforting drink
                         - Watch the sunset or the sky
                         - Write down 3 things you’re grateful for
                         - Do one thing slowly and mindfully
                         - Take a relaxing shower
                         - Go to sleep a little earlier
                         - Avoid checking your phone first thing in the morning
                         - Compliment yourself today
                         - Listen to a podcast that inspires you
                         - Light a candle and relax
                         - Take a short nap
                         - Meditate for 5 minutes
                         - Organize your desk
                         - Write one positive memory
                         - Eat a meal without distractions
                         - Smile at yourself in the mirror
                         - Delete one toxic app for the day
                         - Take a break from notifications
                         - Spend time in silence
                         - Try a breathing exercise
                         - Listen to nature sounds
                         - Do a skincare routine
                         - Write a positive affirmation
                         - Wear your favorite outfit
                         - Spend 10 minutes without screens
                         - Write one goal for tomorrow
                         - Dance to your favorite song
                         - Make your bed
                         - Take a photo of something beautiful
                         - Cook yourself a healthy meal
                         - Open a window and breathe fresh air
                         - Do a random act of kindness
                         - Watch something that comforts you
                         - Take care of a plant
                         - Journal before sleeping
                         - Spend time with a pet
                         - Do a gentle workout
                         - Listen to your body today
                         - Rest without guilt
                         - Write one thing you love about yourself
                         - Try a new tea or coffee
                         - Take a moment to breathe deeply
                         - Delete old negative photos
                         - Avoid comparing yourself today
                         - Put your phone away during a meal
                         - Spend time in the sun
                         - Watch the clouds
                         - Do one thing that makes you happy
                         - Reorganize a small area
                         - Take a mindful walk
                         - Read inspiring quotes
                         - Wear something comfortable
                         - Spend 5 minutes reflecting
                         - Practice gratitude
                         - Write down your thoughts
                         - Avoid negative self-talk
                         - Spend time away from noise
                         - Do a face mask
                         - Take a slow morning
                         - Listen to calming music
                         - Go outside without your phone
                         - Tidy your room
                         - Pause and stretch
                         - Watch your favorite movie
                         - Drink herbal tea
                         - Take a social media break
                         - Make a healthy snack
                         - Sit quietly for 5 minutes
                         - Look at old happy photos
                         - Do a small creative activity
                         - Practice self-compassion
                         - Take a warm bath
                         - Spend time doing nothing
                         - Write down one achievement
                         - Focus on the present moment
                         - Walk barefoot on grass
                         - Open up a little today
                         - Try positive self-talk
                         - Write your feelings instead of bottling them up
                         - Take a mindful breath break
                         - Look at the stars
                         - Slow down your pace today
                         - Take care of your mental space
                         - Allow yourself to rest
                         - Do something comforting
                         - Listen to your favorite artist
                         - Take care of your sleep
                         - Reflect on your emotions
                         - Celebrate a small win

                        14. JSON FORMAT MUST BE:

                        {
                            "challenges": [
                                {
                                    "challenge_type": "daily",
                                    "title": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "description": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "points": 10,
                                    "concept_title": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "concept_description": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "about_challenge": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "exercises": [
                                        {
                                            "title": {
                                                "en": "",
                                                "zh": "",
                                                "hi": "",
                                                "es": "",
                                                "fr": "",
                                                "de": "",
                                                "ru": "",
                                                "pt": "",
                                                "it": "",
                                                "ro": ""
                                            },
                                            "step_number": 1
                                        }
                                    ]
                                }
                            ]
                        }
                        `;
        const response = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.8,
            messages: [
                {
                    role: "system",
                    content: "You generate emotionally supportive wellness challenges in strict JSON format.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: {
                type: "json_object",
            },
        });
        const aiResponse = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!aiResponse) {
            throw new Error("No AI response generated");
        }
        const parsed = JSON.parse(aiResponse);
        const finalChallenges = parsed.challenges.map((item) => (Object.assign(Object.assign({}, item), { user_id: userId })));
        return {
            success: true,
            data: finalChallenges,
        };
    }
    catch (error) {
        console.log("generateUserChallenges Error =>", error);
        return {
            success: false,
            message: "Failed to generate challenges",
        };
    }
});
exports.generateUserChallengesDaily = generateUserChallengesDaily;
const generateUserChallengesWeekly = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const prompt = `
                        You are an emotional wellness challenge generator for a self-care mobile app.

                        Generate personalized challenges for a user based on onboarding answers.

                        USER DATA:
                        - What brings user here: ${payload.bringsYouHere}
                        - How user feeling lately: ${payload.howFellingLately}
                        - What user wants to feel more: ${payload.likeToFellMore}
                        - Time user can commit: ${payload.timeYouCommit}
                        - Ready to start level: ${payload.startShowingOfYourSelf}

                        IMPORTANT RULES:

                        1. Generate TOTAL 3 challenges:

                        2. WEEKLY challenges:
                        - Focus on social connection
                        - Prevent isolation
                        - Encourage healthy communication
                        - Encourage reconnecting with people
                        - Encourage outside-world interaction gently
                        - points must be 25

                        3. Every challenge must contain:
                        - challenge_type
                        - title
                        - description
                        - points
                        - concept_title
                        - concept_description
                        - about_challenge
                        - exercises

                        4. Each challenge must contain EXACTLY 5 exercises.

                        5. Every exercise must contain:
                        - title
                        - step_number

                        6. step_number must start from 1 to 5

                        7. Exercises must be:
                        - short
                        - actionable
                        - easy to understand
                        - emotionally supportive

                        8. Generate content in ALL languages:
                        en, zh, hi, es, fr, de, ru, pt, it, ro

                        9. Return ONLY valid JSON.

                        10. DO NOT return markdown.

                        11. Keep tone:
                        - warm
                        - emotionally safe
                        - supportive
                        - simple
                        - non-medical

                        12.Weekly Challenge Ideas
                        - Call a friend or family member
                        - Spend time with someone you care about
                        - Go to a social event
                        - Try a new activity
                        - Visit a new place
                        - Have a conversation without distractions
                        - Buy yourself something small you enjoy
                        - Spend an afternoon outside
                        - Take yourself on a solo date
                        - Reconnect with someone you miss
                        - Start a new healthy habit
                        - Write a letter you’ll never send
                        - Open up honestly to someone
                        - Do something outside your comfort zone
                        - Spend one day being kinder to yourself
                        - Take a break from toxic content
                        - Help someone around you
                        - Plan a relaxing activity for yourself
                        - Create a small goal for the week
                        - Let yourself rest without guilt
                        - Try a new café or restaurant
                        - Spend a day without social media
                        - Visit a family member
                        - Go to the cinema
                        - Attend a local event
                        - Take a long walk in nature
                        - Spend quality time with friends
                        - Declutter your room
                        - Cook a meal for yourself
                        - Start reading a new book
                        - Go to a bookstore
                        - Watch the sunrise
                        - Plan your week mindfully
                        - Write a gratitude letter
                        - Go somewhere peaceful
                        - Spend time near water
                        - Take a day for self-care
                        - Try a creative hobby
                        - Have a deep conversation
                        - Learn something new
                        - Visit a museum or exhibition
                        - Spend time offline
                        - Go on a small adventure
                        - Practice saying no
                        - Treat yourself gently this week
                        - Take a mental health day
                        - Write down your weekly emotions
                        - Listen to a full album without distractions
                        - Have a picnic
                        - Reconnect with an old hobby
                        - Try yoga or meditation
                        - Do something spontaneous
                        - Spend time with animals
                        - Take a break from negativity
                        - Support a local business
                        - Watch a motivational video
                        - Spend time with your thoughts
                        - Explore a new neighborhood
                        - Do something you’ve postponed
                        - Have a slow morning
                        - Take yourself out for coffee
                        - Watch the stars one night
                        - Write your goals for the month
                        - Create a relaxing playlist
                        - Spend time away from screens
                        - Invite someone for lunch
                        - Do a digital detox day
                        - Visit a park
                        - Reflect on your progress
                        - Do something creative
                        - Take a train or car ride somewhere new
                        - Journal about your week
                        - Practice forgiveness
                        - Reconnect with your emotions
                        - Do something that scares you slightly
                        - Spend intentional time alone
                        - Take yourself shopping
                        - Watch a comforting movie
                        - Try a new workout
                        - Spend time with loved ones
                        - Organize your personal space
                        - Make a vision board
                        - Celebrate a small achievement
                        - Talk to someone new
                        - Focus on your well-being
                        - Have a calm evening without your phone
                        - Try a new healthy recipe
                        - Spend a day more present
                        - Write about what you learned this week
                        - Go to bed earlier all week
                        - Practice being kinder to yourself
                        - Reconnect with your dreams
                        - Do one thing that makes you proud
                        - Spend time appreciating life
                        - Reset your routine
                        - Spend time in nature
                        - Focus on healing this week
                        - Reconnect with your inner peace
                        - Allow yourself to slow down
                        - Do something meaningful for yourself

                        13. JSON FORMAT MUST BE:

                        {
                            "challenges": [
                                {
                                    "challenge_type": "daily",
                                    "title": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "description": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "points": 10,
                                    "concept_title": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "concept_description": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "about_challenge": {
                                        "en": "",
                                        "zh": "",
                                        "hi": "",
                                        "es": "",
                                        "fr": "",
                                        "de": "",
                                        "ru": "",
                                        "pt": "",
                                        "it": "",
                                        "ro": ""
                                    },
                                    "exercises": [
                                        {
                                            "title": {
                                                "en": "",
                                                "zh": "",
                                                "hi": "",
                                                "es": "",
                                                "fr": "",
                                                "de": "",
                                                "ru": "",
                                                "pt": "",
                                                "it": "",
                                                "ro": ""
                                            },
                                            "step_number": 1
                                        }
                                    ]
                                }
                            ]
                        }
                        `;
        const response = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.8,
            messages: [
                {
                    role: "system",
                    content: "You generate emotionally supportive wellness challenges in strict JSON format.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: {
                type: "json_object",
            },
        });
        const aiResponse = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!aiResponse) {
            throw new Error("No AI response generated");
        }
        const parsed = JSON.parse(aiResponse);
        const finalChallenges = parsed.challenges.map((item) => (Object.assign(Object.assign({}, item), { user_id: userId })));
        return {
            success: true,
            data: finalChallenges,
        };
    }
    catch (error) {
        console.log("generateUserChallenges Error =>", error);
        return {
            success: false,
            message: "Failed to generate challenges",
        };
    }
});
exports.generateUserChallengesWeekly = generateUserChallengesWeekly;
