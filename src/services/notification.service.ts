import firebaseAdmin from "../configs/firebase.config";
import statusCodes from "../constants/statusCodes";
import { showResponse } from "../utils/response.util";

const sendTopicNotification = (topic: string, title: string, message: string, data: any) => {
    return new Promise((resolve) => {
        try {

            // Ensure all data values are strings, properly serializing objects
            const stringData = Object.keys(data).reduce((acc: any, key) => {
                const value = data[key];
                if (typeof value === 'object' && value !== null) {
                    // Serialize objects and add a marker
                    acc[key] = JSON.stringify(value);
                } else {
                    acc[key] = String(value);
                }
                return acc;
            }, {});

            const messageData = {
                topic: topic.toString(),
                notification: {
                    title: title,
                    body: message
                },
                data: stringData,
                android: {
                    notification: {
                        channel_id: "high-priority-channel" as any, // Must match the ID created in the app
                        priority: "high" as any  // Sets the priority for pre-Oreo devices
                    }
                },
            };

            firebaseAdmin.messaging().send(messageData)
                .then((response) => {
                    return resolve(showResponse(true, "Notification sent successfully", response, statusCodes.SUCCESS));
                })
                .catch((error) => {
                    return resolve(showResponse(false, "Failed to send notification", error, statusCodes.API_ERROR));
                });

        } catch (err: any) {
            console.log(err);
            return resolve(showResponse(true, "Unable to send notification", err.message, statusCodes.API_ERROR));
        }
    });
}
//ends

export { sendTopicNotification }

