import { findOne, saveNotification } from "../helpers/db.helpers";
import adminAuthModel from "../modules/AdminAuth/admin.auth.model";
import services from "../services";

// const initizalizeMediaQueue = (filesObj: any, index: number, buffer: any, QueryData: any) => {
//     console.log(index, "indexQueueunder")
//     const { media_type } = QueryData
//     // let fileBuffer = Buffer.from(buffer); //convert file buffer to orignal buffer

//     const QueueName = `Media-${Math.floor(Math.random() * 1000000)}` //create queue name dynamically for every file
//     const MediaQueue = commonHelper.generateQueue(QueueName) //generate queue

//     //add data in the queue
//     MediaQueue.add(filesObj, { //dont include file buffer in array 
//         delay: (index * 30000), //30 seconds 
//         attempt: 1,
//         removeOnComplete: true
//     })

//     //starts the queue process
//     MediaQueue.process(async (job: any, done: any) => {
//         const mediaFiles = job?.data //single media in file object

//         //upload media to s3  one by one 
//         services.awsService.uploadQueueMediaToS3([mediaFiles]).then(async (uploaded_file_url: any) => {
//             const addObj = {
//                 media_type,
//                 url: uploaded_file_url[0]
//             };

//             const ref = new galleryModel(addObj)

//             const saveMedia = await createOne(ref)
//             // console.log(saveMedia, "saveMediaa")
//             if (!saveMedia.status) {
//                 console.log('Error While Save Media in Database')
//             }

//         }).catch((err) => {
//             console.log("Queue error on aws response", err)
//         })
//         done()
//     })

// }//ends


const initializeNotificationQueue = async (notificationQueue: any) => {
  if (!notificationQueue) {
    console.error("Notification queue not provided");
    return;
  }

  // -------------------- HELPER: USER NOTIFICATION WITH RETRY --------------------
  const notifyUserWithRetry = async (user: any, adminId: string, title: string, notificationType: string, maxRetries = 1) => {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const userId = user._id.toString();
        const description = `Hello ${user.first_name}, this is a notification from admin.`;

        // Save notification
        const notification = await saveNotification(
          { user_id: adminId },
          { user_id: userId },
          title,
          description,
          notificationType
        );

        // Send push notification only if enabled
        if (user.notification_enabled === true) {
          await services.notificationService.sendTopicNotification(
            userId,
            title,
            description,
            {
              type: notificationType,
              createdAt: new Date(),
              _id: notification?.data?._id,
            }
          );
        }
        return;
      } catch (error) {
        attempt++;
        if (attempt > maxRetries) {
          throw error;
        }
        // Optional delay before retry
        await new Promise((res) => setTimeout(res, 500));
      }
    }
  };

  // -------------------- JOB PROCESSOR --------------------
  notificationQueue.process(1, async (job: any) => {

    const result = {
      success: true,
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as string[],
    };

    try {
      const { users } = job.data;
      // -------------------- VALIDATION --------------------
      if (!Array.isArray(users) || users.length === 0) {
        console.warn(`Job ${job.id}: No users to notify`);
        return result;
      }
      result.processed = users.length;

      // -------------------- ADMIN --------------------
      const adminData = await findOne(adminAuthModel, {});
      if (!adminData?.status || !adminData?.data?._id) {
        throw new Error("Admin not found");
      }

      const adminId = adminData.data._id.toString();
      //you can change title and notificationType according to your need
      const title = "New Notification";
      const notificationType = "reminder";

      // -------------------- USER PROCESSING --------------------
      await Promise.all(
        users.map(async (user: any) => {
          try {
            await notifyUserWithRetry(user, adminId, title, notificationType,
              1 // retry once
            );
            result.succeeded++;
          } catch (err: any) {
            result.failed++;
            result.success = false;
            const errorMsg = `User ${user?._id}: ${err.message}`;
            result.errors.push(errorMsg);
          }
        })
      );

      // Limit error payload size
      result.errors = result.errors.slice(0, 5);
      return result;
    } catch (error: any) {
      console.error(`Job ${job.id} crashed:`, error.message);
      throw error; // Important: marks job as failed
    }
  });

  // -------------------- QUEUE EVENTS --------------------
  notificationQueue.on("completed", (job: any, result: any) => {
    console.log(`Job ${job.id} completed: ${result.succeeded}/${result.processed} succeeded`);
  });

  notificationQueue.on("failed", (job: any, error: Error) => {
    console.error(`Job ${job.id} failed:`, error.message);
  });

  notificationQueue.on("error", (error: any) => {
    console.error("Queue error:", error);
  });
};



export { initializeNotificationQueue }



