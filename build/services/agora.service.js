"use strict";
// import { ApiResponse } from "../utils/interfaces.util";
// import { showResponse } from "../utils/response.util";
// import statusCodes from '../constants/statusCodes'
// import responseMessages from "../constants/responseMessages";
// // import userEventStreamModel from "../models/User/user.eventStream.model";
// import axios from "axios";
// import moment from "moment";
// import { AWS_CREDENTIAL, AGORA_CREDENTIAL } from "../constants/app.constant";
// import { RtcTokenBuilder, RtcRole } from 'agora-token';
// import { findOneAndUpdate } from "../helpers/db.helpers";
// import mongoose, { Schema, model } from 'mongoose';
// //EXAMPLE
// const userEventStreamModel = new Schema(
//     {
//         event_id: { type: mongoose.Types.ObjectId, ref: "events" },
//         user_id: { type: mongoose.Types.ObjectId, ref: "users" },
//         cname: { type: String, default: '' },
//         uid: { type: String },
//         is_live: { type: String, default: '' },
//         agora_token: { type: String, default: '' },
//         files: { type: Number, default: null },
//         used_name: { type: String, default: null }, //used_name ==>> 1 = original_name, 2 = anonymous_name (on project reqirement)
//         started_at: { type: String, default: null },
//     },
//     {
//         toJSON: { virtuals: true },
//         toObject: { virtuals: true },
//         id: false,
//         versionKey: false,
//         // collection: 'admin'
//         timestamps: true
//     },
// )
// const UserEventHandler = {
//     /** Agora backend api implementation for live streaming the save recording to cloud storage and s3 */
//     /** 
//      *  step:1 :- Hit createAgoraToken api in response we will get a token used by frontend
//      *  step:2 :- Hit acquireRecording api in response we will get "resourceId" that has to pass in start recording api
//      *  step:3 :- Hit startRecording api in response we will get "sid" that has to pass in updateRecording and stopRecording api
//      *  step:4 :- Hit updateRecording api to update the layout of the recording (optional according to project requirement)
//      *  step:5 :- Hit statusRecording api to get the status of the recording. It will be hit after startRecording and before stopRecording (optional according to project requirement)
//      *  step:6 :- Hit stopRecording api to stop the recording and get the file list 
//      *  step:7 :- Hit deleteRecording api to delete the recording from agora cloud (optional according to project requirement)
//     */
//     async createAgoraToken(uid: number, channelName: string, user_id: string, event_id: string, used_name: string): Promise<ApiResponse> {
//         try {
//             const appId = await AGORA_CREDENTIAL.AGORA_APP_ID;
//             const appCertificate = await AGORA_CREDENTIAL.AGORA_APP_CERTIFICATE;
//             const role = RtcRole.PUBLISHER;
//             const tokenExpirationInSecond = 3600;
//             const privilegeExpirationInSecond = 3600;
//             const token = RtcTokenBuilder.buildTokenWithUid(
//                 appId,
//                 appCertificate,
//                 channelName,
//                 uid,
//                 role,
//                 tokenExpirationInSecond,
//                 privilegeExpirationInSecond
//             );
//             // // Save/Update live stream entry
//             // const query = { event_id, user_id, is_live: true }
//             // const updateQuery = { event_id, cname: channelName, uid, user_id, is_live: true, agora_token: token, used_name: Number(used_name), started_at: moment().unix() } // used_name ==>> 1 = original_name, 2 = anonymous_name (on project reqirement)
//             // await findOneAndUpdate(userEventStreamModel, query, updateQuery)
//             return showResponse(true, responseMessages?.common.stream_token_genrated_success, token, statusCodes.SUCCESS);
//         } catch (error) {
//             console.error("Error creating Agora token:", error);
//             return showResponse(false, responseMessages?.common.stream_token_genrated_failure, null, statusCodes.API_ERROR);
//         }
//     },
//     async acquireRecording(channel_name: string, uid: string): Promise<ApiResponse> {
//         try {
//             const customerKey = await AGORA_CREDENTIAL.AGORA_CUSTOMER_ID;
//             const customerSecret = await AGORA_CREDENTIAL.AGORA_CUSTOMER_SECRET;
//             const AGORA_APP_ID = await AGORA_CREDENTIAL.AGORA_APP_ID;
//             const encodedCredential = Buffer
//                 .from(`${customerKey}:${customerSecret}`)
//                 .toString('base64');
//             const headers = {
//                 'Authorization': `Basic ${encodedCredential}`,
//                 'Content-Type': 'application/json'
//             };
//             const body = {
//                 cname: channel_name,
//                 uid,
//                 clientRequest: {}
//             };
//             const response = await axios.post(
//                 `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/acquire`,
//                 body,
//                 { headers }
//             );
//             return showResponse(true, responseMessages?.common.resource_id_genrated_success, response.data, statusCodes.SUCCESS);
//         } catch (error: any) {
//             return showResponse(false, "Acquire failed", error?.response?.data || error.message, statusCodes.API_ERROR);
//         }
//     },
//     async startRecording(resourceId: string, cname: string, agora_token: string, uid: string): Promise<ApiResponse> {
//         try {
//             const bucketName = await AWS_CREDENTIAL.BUCKET_NAME;
//             const SecretKey = await AWS_CREDENTIAL.AWS_SECRET
//             const AccessKey = await AWS_CREDENTIAL.ACCESSID
//             const customerKey = await AGORA_CREDENTIAL.AGORA_CUSTOMER_ID
//             const customerSecret = await AGORA_CREDENTIAL.AGORA_CUSTOMER_SECRET
//             const AGORA_APP_ID = await AGORA_CREDENTIAL.AGORA_APP_ID
//             // Concatenate customer key and customer secret and use base64 to encode the concatenated string
//             const plainCredential = customerKey + ":" + customerSecret
//             // Encode with base64
//             const encodedCredential = Buffer.from(plainCredential).toString('base64')
//             const authorizationField = "Basic " + encodedCredential
//             //layout configuration
//             let url = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`
//             let requestDataObj = {
//                 cname: cname?.toString(),
//                 uid: uid,
//                 clientRequest: {
//                     token: agora_token,
//                     recordingConfig: {
//                         channelType: 0, // 1 = Live Broadcast , 0 = Communication
//                         streamTypes: 2, // Both audio and video
//                         maxIdleTime: 250,
//                         audioProfile: 1,
//                         videoStreamType: 0,
//                         transcodingConfig: {
//                             height: 720,
//                             width: 1280,
//                             bitrate: 1130,
//                             fps: 30,
//                             mixedVideoLayout: 0,
//                             maxResolutionUid: "1"
//                         }
//                     },
//                     recordingFileConfig: {
//                         avFileType: [
//                             "hls",
//                             "mp4"
//                         ]
//                     },
//                     storageConfig: {
//                         accessKey: AccessKey,
//                         region: Number(5),   // 1 = US East (N. Virginia), 2 = US West (Oregon), 3 = Asia Pacific (Singapore) etc set according to your aws region
//                         bucket: bucketName,
//                         secretKey: SecretKey,
//                         vendor: Number(1),   // 1 = AWS S3
//                         fileNamePrefix: [
//                             "streamrecordings",
//                             "viewport" + moment().unix()
//                         ]
//                     }
//                 }
//             }
//             let headers = {
//                 headers: {
//                     'Authorization': authorizationField,
//                     'Content-Type': 'application/json; charset=utf-8'
//                 }
//             }
//             const startRecResponse = await axios.post(url, requestDataObj, headers);
//             return showResponse(true, responseMessages.common.recording_started, startRecResponse.data, statusCodes.SUCCESS);
//         } catch (error) {
//             console.error("Error creating Agora token:", error);
//             return showResponse(false, responseMessages.common.recording_started_failure, null, statusCodes.API_ERROR);
//         }
//     },
//     async updateRecording(resourceId: string, sid: string, cname: string, uid: string): Promise<ApiResponse> {
//         try {
//             const customerKey = await AGORA_CREDENTIAL.AGORA_CUSTOMER_ID
//             const customerSecret = await AGORA_CREDENTIAL.AGORA_CUSTOMER_SECRET
//             const AGORA_APP_ID = await AGORA_CREDENTIAL.AGORA_APP_ID
//             // Concatenate customer key and customer secret and use base64 to encode the concatenated string
//             const plainCredential = customerKey + ":" + customerSecret
//             // Encode with base64
//             const encodedCredential = Buffer.from(plainCredential).toString('base64')
//             const authorizationField = "Basic " + encodedCredential
//             //layout configuration
//             let url = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/updateLayout`
//             let requestDataObj = {
//                 cname: cname?.toString(),
//                 uid: uid,
//                 clientRequest: {
//                     mixedVideoLayout: 0,
//                     maxResolutionUid: uid?.toString()
//                 }
//             }
//             let headers = {
//                 headers: {
//                     'Authorization': authorizationField,
//                     'Content-Type': 'application/json; charset=utf-8'
//                 }
//             }
//             const updateRecResponse = await axios.post(url, requestDataObj, headers);
//             return showResponse(true, responseMessages.common.recording_updated, updateRecResponse.data, statusCodes.SUCCESS);
//         } catch (err) {
//             console.log("start recording", err)
//             return showResponse(false, responseMessages?.common.recording_updated_failure, null, statusCodes.API_ERROR);
//         }
//     },
//     async statusRecording(resourceId: string, sid: string): Promise<ApiResponse> {
//         try {
//             const customerKey = await AGORA_CREDENTIAL.AGORA_CUSTOMER_ID
//             const customerSecret = await AGORA_CREDENTIAL.AGORA_CUSTOMER_SECRET
//             const AGORA_APP_ID = await AGORA_CREDENTIAL.AGORA_APP_ID
//             const plainCredential = customerKey + ":" + customerSecret
//             // Encode with base64
//             const encodedCredential = Buffer.from(plainCredential).toString('base64')
//             const authorizationField = "Basic " + encodedCredential
//             let url = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/query`
//             let headers = {
//                 headers: {
//                     'Authorization': authorizationField,
//                     'Content-type': 'application/json;charset=utf-8'
//                 }
//             }
//             const statusRecResponse = await axios.get(url, headers);
//             return showResponse(true, responseMessages?.common.recording_status_success, statusRecResponse.data, statusCodes.SUCCESS);
//         } catch (err) {
//             console.log("Status Recording", err)
//             return showResponse(false, responseMessages?.common.recording_status_failure, null, statusCodes.API_ERROR);
//         }
//     },
//     async stopRecording(resourceId: string, sid: string, cname: string, uid: string, event_id: string, user_id: string): Promise<ApiResponse> {
//         try {
//             const customerKey = await AGORA_CREDENTIAL.AGORA_CUSTOMER_ID;
//             const customerSecret = await AGORA_CREDENTIAL.AGORA_CUSTOMER_SECRET;
//             const AGORA_APP_ID = await AGORA_CREDENTIAL.AGORA_APP_ID;
//             const encodedCredential = Buffer.from(customerKey + ":" + customerSecret).toString("base64");
//             const authorizationField = "Basic " + encodedCredential;
//             const stopUrl = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`;
//             const stopResponse = await axios.post(stopUrl, {
//                 cname: cname?.toString(),
//                 uid: uid,
//                 clientRequest: { async_stop: false },
//             }, { headers: { Authorization: authorizationField } });
//             if (stopResponse.status !== 200) {
//                 return showResponse(false, responseMessages?.common.recording_stop_failure, null, statusCodes.API_ERROR);
//             }
//             // Update stream status only — let status API handle file list separately
//             // const query = { event_id, user_id, cname }
//             // const updateObj = { is_live: false, files: stopResponse.data?.serverResponse?.fileList, stopped_at: moment().unix() }
//             // await findOneAndUpdate(userEventStreamModel, query, updateObj)
//             return showResponse(true, responseMessages?.common.recording_stop_success, stopResponse.data, statusCodes.SUCCESS);
//         } catch (err) {
//             console.log("Stopped recording", err);
//             return showResponse(false, responseMessages?.common.recording_stop_failure, null, statusCodes.API_ERROR);
//         }
//     },
//     // async listLiveStreamsEvent(event_id: string): Promise<ApiResponse> {
//     //     const liveStreams = await userEventStreamModel.find({
//     //         event_id: event_id,
//     //         is_live: true
//     //     }).populate("user_id", "user_name profile_pic anonymous_name");
//     //     console.log("liveStreams list", liveStreams)
//     //     return showResponse(true, responseMessages?.common.data_retreive_sucess, liveStreams, statusCodes.SUCCESS);
//     // },
//     async deleteRecording(resourceId: string, sid: string): Promise<ApiResponse> {
//         try {
//             const customerKey = await AGORA_CREDENTIAL.AGORA_CUSTOMER_ID
//             const customerSecret = await AGORA_CREDENTIAL.AGORA_CUSTOMER_SECRET
//             const AGORA_APP_ID = await AGORA_CREDENTIAL.AGORA_APP_ID
//             const plainCredential = customerKey + ":" + customerSecret
//             // Encode with base64
//             const encodedCredential = Buffer.from(plainCredential).toString('base64')
//             const authorizationField = "Basic " + encodedCredential
//             let url = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/delete`
//             let headers = {
//                 headers: {
//                     'Authorization': authorizationField,
//                     'Content-type': 'application/json;charset=utf-8'
//                 }
//             }
//             const deleteRecResponse = await axios.post(url, {}, headers);
//             return showResponse(true, responseMessages?.common.recording_delete_success, deleteRecResponse.data, statusCodes.SUCCESS);
//         } catch (err) {
//             console.log("Status Recording", err)
//             return showResponse(false, responseMessages?.common.recording_delete_failure, null, statusCodes.API_ERROR);
//         }
//     },
// }
// export default UserEventHandler;
