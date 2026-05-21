import OpenAI from "openai";
import { APP } from "../constants/app.constant";

const openai = new OpenAI({
  apiKey: APP.OPENAI_API_KEY,
});

type GenerateChallengePayload = {
  bringsYouHere: string;
  howFellingLately: string;
  likeToFellMore: string;
  timeYouCommit: string;
  startShowingOfYourSelf: string;
};

export const generateUserChallengesDaily = async (payload: GenerateChallengePayload, userId: string) => {
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

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      temperature: 0.4,

      messages: [
        {
          role: "system",
          content:
            "You generate emotionally supportive wellness challenges in strict JSON format.",
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

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No AI response generated");
    }

    const parsed = JSON.parse(aiResponse);

    const finalChallenges = parsed.challenges.map((item: any) => ({
      ...item,
      user_id: userId,
    }));

    return {
      success: true,
      data: finalChallenges,
    };

  } catch (error) {

    console.log("generateUserChallenges Error =>", error);

    return {
      success: false,
      message: "Failed to generate challenges",
    };
  }
};

export const generateUserChallengesWeekly = async (payload: GenerateChallengePayload, userId: string) => {
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

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      temperature: 0.4,

      messages: [
        {
          role: "system",
          content:
            "You generate emotionally supportive wellness challenges in strict JSON format.",
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

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No AI response generated");
    }

    const parsed = JSON.parse(aiResponse);

    const finalChallenges = parsed.challenges.map((item: any) => ({
      ...item,
      user_id: userId,
    }));

    return {
      success: true,
      data: finalChallenges,
    };

  } catch (error) {

    console.log("generateUserChallenges Error =>", error);

    return {
      success: false,
      message: "Failed to generate challenges",
    };
  }
};