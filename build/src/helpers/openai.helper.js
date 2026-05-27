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
                        - How user feeling lately: ${payload.howFellingLately}
                        - What user wants to feel more: ${payload.likeToFellMore}
                        - Time user can commit: ${payload.timeYouCommit}
                        - What make user to feel that way: ${payload.feelThatWay}
                        - What stop user to feel better: ${payload.stopFeelBetter}
                        - goal user start with: ${payload.goalStartWith}
                        - How user heard about us: ${payload.hearAboutUs}
                        - User name: ${payload.fullName}
                        - what user feel better: ${payload.helpFeelBetter}
                        
                        

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
                        - points
                        - exercises

                        4. Each challenge must contain EXACTLY 5 exercises.

                        5. Every exercise must contain:
                        - title
                        - step_number

                        6. step_number must start from 1 to 5

                        7. Exercises must be:
                          - Exercises should be short and supportive.

                        8. Return ONLY valid JSON.

                        9. DO NOT return markdown.

                        10. Keep tone:
                        - warm
                        - emotionally safe
                        - supportive
                        - simple
                        - non-medical

                        11.Some Daily Challenge Ideas
                         - mindful breathing
                         - journaling
                         - hydration
                         - short walk
                         - gratitude

                        14. JSON FORMAT MUST BE:

                        {
                            "challenges": [
                                {
                                    "challenge_type": "daily",
                                    "title": "",
                                    "points": 10,
                                    "exercises": [
                                        {
                                            "title":"",
                                            "step_number": 1
                                        }
                                    ]
                                }
                            ]
                        }
                        `;
        const response = yield openai.chat.completions.create({
            model: "gpt-4.1-nano",
            temperature: 0.4,
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
                        - How user feeling lately: ${payload.howFellingLately}
                        - What user wants to feel more: ${payload.likeToFellMore}
                        - Time user can commit: ${payload.timeYouCommit}
                        - What make user to feel that way: ${payload.feelThatWay}
                        - What stop user to feel better: ${payload.stopFeelBetter}
                        - goal user start with: ${payload.goalStartWith}
                        - How user heard about us: ${payload.hearAboutUs}
                        - User name: ${payload.fullName}
                        - what user feel better: ${payload.helpFeelBetter}

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

                        4. Each challenge must contain 1 to 5 exercises.

                        5. Every exercise must contain:
                        - title
                        - step_number

                        6. step_number must start from 1 to 5

                        7. Exercises must be:
                        - short
                        - actionable
                        - easy to understand
                        - emotionally supportive

                        8. Return ONLY valid JSON.

                        9. DO NOT return markdown.

                        11. Keep tone:
                        - warm
                        - emotionally safe
                        - supportive
                        - simple
                        - non-medical

                        12.Weekly Challenge Ideas
                       Example ideas:
                        - social connection
                        - mindfulness
                        - gratitude
                        - nature walk
                        - journaling
                        - self-care

                          14. JSON FORMAT MUST BE:

                        {
                            "challenges": [
                                {
                                    "challenge_type": "daily",
                                    "title": "",
                                    "points": 25,
                                    "exercises": [
                                        {
                                            "title":"",
                                            "step_number": 1
                                        }
                                    ]
                                }
                            ]
                        }
                        `;
        const response = yield openai.chat.completions.create({
            model: "gpt-4.1-nano",
            temperature: 0.4,
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
