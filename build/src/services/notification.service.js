"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTopicNotification = void 0;
const firebase_config_1 = __importDefault(require("../configs/firebase.config"));
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const response_util_1 = require("../utils/response.util");
const sendTopicNotification = (topic, title, message, data) => {
    return new Promise((resolve) => {
        try {
            // Ensure all data values are strings, properly serializing objects
            const stringData = Object.keys(data).reduce((acc, key) => {
                const value = data[key];
                if (typeof value === 'object' && value !== null) {
                    // Serialize objects and add a marker
                    acc[key] = JSON.stringify(value);
                }
                else {
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
                        channel_id: "high-priority-channel", // Must match the ID created in the app
                        priority: "high" // Sets the priority for pre-Oreo devices
                    }
                },
            };
            firebase_config_1.default.messaging().send(messageData)
                .then((response) => {
                return resolve((0, response_util_1.showResponse)(true, "Notification sent successfully", response, statusCodes_1.default.SUCCESS));
            })
                .catch((error) => {
                return resolve((0, response_util_1.showResponse)(false, "Failed to send notification", error, statusCodes_1.default.API_ERROR));
            });
        }
        catch (err) {
            console.log(err);
            return resolve((0, response_util_1.showResponse)(true, "Unable to send notification", err.message, statusCodes_1.default.API_ERROR));
        }
    });
};
exports.sendTopicNotification = sendTopicNotification;
