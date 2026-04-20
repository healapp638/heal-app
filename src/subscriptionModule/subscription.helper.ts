// import Stripe from 'stripe';
// import { STRIPE_CREDENTIAL } from "../constants/app.constant";
// import { showResponse } from "../utils/response.util";
// import moment from 'moment';
// import susbriptionLogs from "../../src/models/User/user.subscriptionLogs.model";
// import susbriptionPlans from "../../src/models/User/user.subscriptionPlans.model";
// import user from "../../src/models/User/user.auth.model";


// const initialiseStripe = async () => {
//     try {
//         const STRIPE_SEC_KEY = await STRIPE_CREDENTIAL.STRIPE_SEC_KEY
//         console.log(STRIPE_CREDENTIAL.STRIPE_VERSION, "version stripe")
//         const stripeInit = new Stripe(STRIPE_SEC_KEY, {
//             // @ts-ignore
//             apiVersion: STRIPE_CREDENTIAL.STRIPE_VERSION,
//             typescript: true
//         });

//         return stripeInit
//     } catch (error) {
//         console.log(error, "Error Stripe")
//     }

// }

// const createCustomerId = async (email: string) => {
//     try {
//         const stripe: any = await initialiseStripe()

//         const customer = await stripe.customers.create({ email: email }); //first tym acc create
//         if (customer) {
//             return showResponse(true, 'Request success', customer, 200);
//         }
//         return showResponse(false, 'Request failed!!', null, 400);

//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, 'Create Stripe Customer Request failed!!', 400);
//     }

// }

// const getPriceList = async (limit = 10) => {
//     try {
//         const stripe: any = await initialiseStripe()
//         const itemList = await stripe.prices.list({
//             limit: limit,
//             expand: ['data.product'],
//         });

//         if (itemList) {
//             return showResponse(true, 'Price list get successfully', itemList, 200);
//         }
//         return showResponse(false, 'Request failed!!', null, 400);

//     } catch (error: any) {
//         // Handle errors
//         console.error('Error retrieving price List:', error);
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);

//     }
// }

// //subscription that user subscribes list
// const getUserSubscriptionList = async (stripeCustormerId: string) => {
//     try {
//         const stripe: any = await initialiseStripe()

//         const subscriptionList = await stripe.subscriptions.list({
//             limit: 10,
//             customer: stripeCustormerId
//         });

//         if (subscriptionList && subscriptionList?.data && subscriptionList?.data?.length > 0) {
//             return showResponse(true, 'Subscription list get', subscriptionList?.data, 200);
//         }
//         return showResponse(false, 'Empty subscription list', null, 400);
//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);
//     }
// }

// const getUserSubscriptionDetail = async (subscriptionId: string) => {
//     try {
//         const stripe: any = await initialiseStripe();
//         const itemRes = await stripe.subscriptions.retrieve(subscriptionId);
//         if (itemRes) {
//             return showResponse(true, 'Subscription detail get successfully', itemRes, 200);
//         }
//         return showResponse(false, 'Invalid subscription detail', null, 400);
//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);
//     }
// }

// const saveCardStripe = async (customer_id: string, token_id: string) => {
//     try {
//         const stripe: any = await initialiseStripe()
//         const savecard = await stripe.customers.createSource(customer_id, { source: token_id });
//         if (savecard) {
//             return showResponse(true, 'Card Saved Successfully', savecard, 200);
//         }
//         return showResponse(false, 'Card Saved Request failed!!', null, 400);

//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, 'Card Saved Request failed!!', 400);
//     }
// }
// const userDefaultSource = async (customer_id: string, card_id: string) => {
//     try {
//         const stripe: any = await initialiseStripe()
//         const itemRes = await stripe.customers.update(customer_id, { default_source: card_id });
//         if (itemRes) {
//             return showResponse(true, 'Card set as default source', itemRes, 200);
//         }
//         return showResponse(false, 'Unable to set default source', null, 400);

//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, 'Default source error occured!!', 400);
//     }
// }

// const purchaseSubscriptionStripe = async (stripe_customer_id: string, price_id: string, add_trial_days: number = 0) => {
//     try {
//         const stripe: any = await initialiseStripe()

//         let subscription_options: any = {
//             customer: stripe_customer_id,
//             items: [{ price: price_id }],
//             expand: ['latest_invoice.payment_intent'],
//         }

//         if(add_trial_days && add_trial_days > 0){
//             let numberOfTrialDays = add_trial_days;
//             let trialPeriodEndDate = moment().add(numberOfTrialDays, 'days').endOf('day').unix();
//             subscription_options.trial_end = trialPeriodEndDate;
//         }

//         const subscription = await stripe.subscriptions.create(subscription_options);
//         if (subscription) {
//             return showResponse(true, 'Subscription Created Successfully', subscription, 200);
//         }
//         return showResponse(false, 'Subscription Creation Request failed!!', null, 400);

//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);

//     }
// }

// const getCustomerDetails = async (data: any) => {
//     try {
//         let { stripe_customer_id, default_payment_source = false } = data

//         const stripe: any = await initialiseStripe();

//         let customer = await stripe.customers.retrieve(stripe_customer_id,
//             { expand: ['default_source'] }
//         );
//         if (customer) {
//             //if default_payment_source is true then check default source of payment is added by the customer or not
//             if (default_payment_source) {
//                 if (!customer.default_source) {
//                     // Customer does not have a default payment source or payment method
//                     return showResponse(false, 'Customer does not have a valid payment source or default payment method.', null, 400);
//                 }
//             }
//             return showResponse(true, 'Stripe customer Details is', customer, 200);
//         }
//         return showResponse(false, 'stripe customer get Request failed!!', null, 400);

//     } catch (error: any) {
//         // Handle errors
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);
//     }
// }

// const cancelUserSubscription = async (subscription_id: string) => {
//     try {
//         const stripe: any = await initialiseStripe()

//         const subscriptionDelete = await stripe.subscriptions.del(subscription_id);
//         if (subscriptionDelete) {
//             return showResponse(true, 'Subscription deleted Successfully', subscriptionDelete, 200);
//         }
//         return showResponse(false, 'Error While Subscription delete ', null, 400);

//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);
//     }
// }

// const cancelPlanTillEndPeriod = async (subscription_id: string) => {
//     try {
//         const stripe: any = await initialiseStripe()

//         const subscriptionCancel = await stripe.subscriptions.update(subscription_id, {
//             cancel_at_period_end: true
//         });
//         if (subscriptionCancel) {
//             return showResponse(true, 'Subscription Cancel Successfully', subscriptionCancel, 200);
//         }
//         return showResponse(false, 'Error While Subscription Cancel ', null, 400);

//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);
//     }
// }

// const saveStripeLogs = async (event: any,stripeCustomerId:any) => {
//     try {
//         let userId;
//         let getUserDetail = await user.findOne({stripe_customer_id:stripeCustomerId});
//         if(getUserDetail){
//             userId = getUserDetail?._id;
//         }
//         const logSave = await susbriptionLogs.create({
//             stripe_customer_id:stripeCustomerId,
//             stripe_event:event,
//             customer_id:userId,
//         });
//         if (logSave) {
//             return showResponse(true, 'Stripe log saved successfully', null, 200);
//         }
//         return showResponse(false, 'Error while save stripe logs', null, 400);

//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);
//     }
// }
// const saveSubscriptionWebhookLogIOS = async (data: any) => {
//     try {

//         let log_data = data;
//         let originalTransactionId = log_data?.subscriptionInfoIOS?.originalTransactionId;
//         let get_user_detail = await user.findOne({ "user_subscription.original_transaction_id": originalTransactionId, status: { $ne: 3 } }, '-passowrd');
//         if (get_user_detail) {
//             /*********add data in UserSubscriptionLog*******/
//             let result = await susbriptionLogs.create({
//                 customer_id: get_user_detail?._id,
//                 type: "ios",
//                 ios_event: log_data,
//             });
//             if (!result) {
//                 return showResponse(false, 'Unable to save ios subscription logs with user refrence', null, 400);
//             }
//             else {
//                 /*if payment_obj.notificaitonType=="DID_RENEW" ; update details in user table*/
//                 let notification_type = log_data?.subscriptionInfoIOS?.notificaiton_type;
//                 let notification_sub_type = log_data?.subscriptionInfoIOS?.notificaiton_sub_type;
//                 if (notification_type == "DID_RENEW" || notification_type == "DID_CHANGE_RENEWAL_PREF" || notification_type == "SUBSCRIBED" || (notification_type == "DID_CHANGE_RENEWAL_STATUS" && notification_sub_type == "AUTO_RENEW_ENABLED")) {
//                     //get plan_id from package id
//                     let get_plan_id = await susbriptionPlans.findOne({ "plan_id": log_data?.subscriptionInfoIOS?.autoRenewProductId })
//                     if (get_plan_id) {
//                         let updatePaymentObj = {
//                             "user_subscription.is_subscribed": 1,
//                             "user_subscription.app_product_id": get_plan_id?._id,
//                             "user_subscription.purchased_on_unix": log_data?.subscriptionInfoIOS?.signedDate,
//                             "user_subscription.next_payment_unix": log_data?.subscriptionInfoIOS?.renewalDate,
//                             "user_subscription.cancelled_on_unix": 0,
//                         }
//                         let update_user = await user.findOneAndUpdate({ _id: get_user_detail?._id }, updatePaymentObj)
//                         if (update_user) {
//                             return showResponse(true, 'Subscription renewed successfully', result, 200);
//                         }
//                         return showResponse(false, 'subscription renewed failed', result, 400);
//                     }else{
//                         return showResponse(false, 'Invalid plan detail', result, 400);                       
//                     }
//                 }

//                 else if ((notification_type == "DID_CHANGE_RENEWAL_STATUS" && notification_sub_type == "AUTO_RENEW_DISABLED") || notification_type == "EXPIRED") {
//                     //get plan_id from package id
//                     let updatePaymentObj = {
//                         "user_subscription.original_transaction_id": "",
//                         "user_subscription.cancelled_on": log_data?.subscriptionInfoIOS?.signedDate,
//                     }
//                     let update_user = await user.updateOne({ _id: get_user_detail?._id }, updatePaymentObj)
//                     if (update_user) {
//                         return showResponse(true, 'Ios subscription renewed successfully', result, 200);
//                     }
//                 }
                
//                 return showResponse(true, 'Ios subscription log saved successfully with user refrence', null, 200);
//             }
//         }
//         else{
//             let result = await susbriptionLogs.create({
//                 type: "ios",
//                 ios_event: log_data,
//             });
//             if (result) {
//                 return showResponse(true, 'Ios subscription log saved successfully without user refrence', null, 200);
//             }
//             else {
//                 return showResponse(false, 'Unable to save ios subscription log without user refrence', null, 400);
//             }
//         }

//     } catch (error: any) {
//         const errorMessage = error.raw ? error.raw.message : error.message;
//         return showResponse(false, errorMessage, null, 400);
//     }
// }

// // const createPaymentIntent = async (user_data: any, metadata: any, amount: number) => {

// //     console.log(amount, "amountll")
// //     const paymentIntent: any = {
// //         currency: 'usd',
// //         customer: user_data?.stripe_acc_id,
// //         amount: amount,
// //         automatic_payment_methods: {
// //             enabled: true
// //         },
// //         metadata: metadata
// //     }
// //     const stripe: any = await initialiseStripe()

// //     const stripePiResponse = await stripe.paymentIntents.create(paymentIntent);

// //     if (stripePiResponse) {
// //         return showResponse(true, 'Request success', stripePiResponse, 200);
// //     }

// //     return showResponse(false, 'Request failed!!', null, 400);


// // }


// // const getPaymentIntent = async (paymentIntentId: string) => {
// //     try {
// //         const stripe: any = await initialiseStripe()
// //         const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
// //         if (paymentIntent) {
// //             return showResponse(true, 'Intent Status Is', paymentIntent, 200);

// //         }
// //         return showResponse(false, 'Request failed!!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error retrieving PaymentIntent:', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);

// //     }
// // }

// // const stripePaymentRefund = async (transferId: string, refundAmountInCents: any, appointmentId: any) => {
// //     const stripe: any = await initialiseStripe()

// //     console.log(refundAmountInCents, "refundAmountInCents")
// //     return new Promise((resolve, reject) => {
// //         stripe.refunds.create({
// //             amount: refundAmountInCents, // already in cents
// //             charge: transferId,
// //             // reason:"Refunded amount, because spa-owner has declined appointment request.",
// //             metadata: {
// //                 refund_amount: refundAmountInCents,
// //                 charge_id: transferId,
// //                 appointment_id: appointmentId,
// //             }
// //         }).then((refund: any) => {
// //             // Resolve with the charge object if successful
// //             resolve({ status: true, message: "Amount refunded successfully", data: refund });
// //         }).catch((error: any) => {
// //             // Reject with the error if transfer fails
// //             resolve({ status: false, message: (error?.message) ?? "Unable to refunded amount", data: error });
// //         });
// //     });
// // }

// // const getProductList = async (limit = 10) => {
// //     try {
// //         const stripe: any = await initialiseStripe()
// //         const subscriptionList = await stripe.products.list({
// //             limit: limit
// //         });

// //         if (subscriptionList) {

// //             let listPayload = await Promise.all(subscriptionList?.data?.map(async (val: any) => {
// //                 // console.log(val, "valvalval");
// //                 let price_value = await getPriceValue(val?.default_price);
// //                 // console.log(price_value, "price_value");

// //                 let obj = { ...val, price_value: price_value?.data }; // Assuming price_value is an array, use price_value[0].data if you want the first element
// //                 return obj;
// //             }))

// //             // Sort the subscription list
// //             const sortedSubscriptionList = listPayload.sort((a, b) => {
// //                 return a.price_value - b.price_value
// //             });


// //             return showResponse(true, 'Subscription List is Status Is', sortedSubscriptionList, 200);

// //         }
// //         return showResponse(false, 'Request failed!!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error retrieving Subscription List:', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);

// //     }
// // }

// // const getSubscriptionProductDetails = async (product_id: string) => {
// //     try {
// //         const stripe: any = await initialiseStripe()

// //         const subscriptionProduct = await stripe.products.retrieve(product_id)
// //         if (subscriptionProduct) {

// //             let priceValueData = await getPriceValue(subscriptionProduct?.default_price);
// //             const productData = { ...subscriptionProduct, price_value: priceValueData?.data }

// //             return showResponse(true, 'Product Details Found ', productData, 200);

// //         }
// //         return showResponse(false, 'Request failed!!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error retrieving Product Details:', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, 'Product DetailsRequest failed!!', 400);

// //     }
// // }


// // const getPriceValue = async (price_id: string) => {
// //     try {
// //         const stripe: any = await initialiseStripe()

// //         const getPrice = await stripe.prices.retrieve(price_id)
// //         if (getPrice) {
// //             // Extract the numeric value
// //             let amount = getPrice.unit_amount_decimal / 100  // Divide by 100 to convert from cents to dollars
// //             return showResponse(true, 'Price is', amount, 200);

// //         }
// //         return showResponse(false, 'Request failed!!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error retrieving Price:', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);

// //     }
// // }




// // const getSavedResourceList = async (customer_id: string) => {
// //     try {
// //         const stripe: any = await initialiseStripe()

// //         const cardList = await stripe.customers.listSources(customer_id, { object: 'card' });
// //         console.log(cardList, "cardList")
// //         if (cardList) {
// //             return showResponse(true, 'Card List Fetched Successfully', cardList?.data, 200);
// //         }
// //         return showResponse(false, 'get Resource List Request failed!!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Resource List Request failed :', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);

// //     }
// // }

// // const deleteCardStripe = async (customer_id: string, card_id: string) => {
// //     try {
// //         const stripe: any = await initialiseStripe()

// //         const deleteCard = await stripe.customers.deleteSource(customer_id, card_id);
// //         if (deleteCard) {
// //             return showResponse(true, 'Card Deleted Successfully', deleteCard, 200);
// //         }
// //         return showResponse(false, 'Card Deleted Request failed!!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error Card Deleted :', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, 'Card Deleted Request failed!!', 400);

// //     }
// // }

// // const getCardTokenDetails = async (token_id: string) => {
// //     try {
// //         const stripe: any = await initialiseStripe()

// //         const getToken = await stripe.tokens.retrieve(token_id);
// //         if (getToken) {
// //             return showResponse(true, 'Token Details fetch Successfully', getToken, 200);
// //         }
// //         return showResponse(false, 'token Details Request failed!!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('token Details Request failed :', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, 'token Details Request failed!!', 400);

// //     }
// // }

// // const getCustomerCardDetails = async (customer_id: string, token_id: string) => {
// //     try {
// //         const stripe: any = await initialiseStripe()

// //         // const getCard = await stripe.customers.retrieveSource(customer_id, token_id);
// //         const getCard = await stripe.customers.retrieveSource(customer_id, token_id);
// //         if (getCard) {
// //             return showResponse(true, 'Card Details fetch Successfully', getCard, 200);
// //         }
// //         return showResponse(false, 'Card Details Request failed!!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Card Details Request failed :', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, 'Card Details Request failed!!', 400);

// //     }
// // }


// // const checkDuplicateCardStripe = async (customer_id: string, token_id: string) => {
// //     try {
// //         const cardData = await getCardTokenDetails(token_id)
// //         // console.log(cardData, "token");

// //         const cardFingerPrint = cardData?.data?.card?.fingerprint
// //         // console.log(cardFingerPrint, "cardDataa");
// //         const cardList = await getSavedResourceList(customer_id)
// //         // console.log(cardList, "cardList");

// //         if (cardList?.data?.length > 0) {
// //             const cardsDataList = cardList?.data
// //             const isDuplicate = cardsDataList.some((card: any) => card.fingerprint === cardFingerPrint)
// //             // console.log(isDuplicate, "isDuplicate");

// //             if (isDuplicate) {
// //                 return showResponse(true, 'Card is already added', null, 200);
// //             }
// //         }
// //         return showResponse(false, 'Failed To Check Card Details', null, 400);

// //     } catch (error: any) {
// //         console.error('Failed Check Card Details :', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);

// //     }
// // } //ends

// // const createProductPackage = async (payload: any) => { //interval is like month year package
// //     try {
// //         //set default interval to year if interval not provided
// //         let { package_name, description, metadata = {}, price, interval = 'year' } = payload
// //         price = Math.round(price * 100)

// //         console.log(interval, "intervalSide")

// //         const stripe: any = await initialiseStripe();

// //         // Create the product
// //         let productPayload = {
// //             name: package_name,
// //             description,
// //             metadata: metadata,
// //             default_price_data: {
// //                 unit_amount: price,
// //                 currency: 'usd',
// //                 recurring: {
// //                     interval: interval,
// //                 }
// //             }
// //         };

// //         const product = await stripe.products.create(productPayload);
// //         // console.log(product, "productt")

// //         if (product) {
// //             return showResponse(true, 'Product and Price Created Successfully', product, 200);
// //         }

// //         return showResponse(false, 'Product creation failed!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error creating product and price:', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);
// //     }
// // };

// // const updateProductPackage = async (payload: any) => { //interval is like month year package
// //     try {
// //         //product is by default set to true if payload not provide to false means inactivate/archive the product 
// //         //interval year by default if interval is not provided
// //         let { product_id, package_name, description, metadata, price, interval = 'year', active = true } = payload

// //         const stripe: any = await initialiseStripe();

// //         let productUpdatePayload: any = { active }
// //         let default_price: any

// //         //if price yet to be chnage than create price and update product
// //         if (price) {
// //             price = Math.round(price * 100)

// //             let pricePayload: any = {
// //                 product: product_id,
// //                 unit_amount: price,
// //                 currency: 'usd',
// //             };

// //             if (interval) {
// //                 pricePayload.recurring = {
// //                     interval: interval,
// //                 }
// //             }

// //             const newPriceObj = await stripe.prices.create(pricePayload);
// //             console.log(newPriceObj, "newPriceObj");

// //             if (newPriceObj) {
// //                 default_price = newPriceObj?.id
// //             }
// //         } //ends

// //         if (package_name) {
// //             productUpdatePayload.name = package_name
// //         }

// //         if (description) {
// //             productUpdatePayload.description = description
// //         }

// //         if (default_price) {
// //             productUpdatePayload.default_price = default_price
// //         }

// //         if (metadata) {
// //             productUpdatePayload.metadata = metadata
// //         }

// //         console.log(productUpdatePayload, "productUpdatePayload")
// //         const productUpdate = await stripe.products.update(product_id, productUpdatePayload);
// //         // console.log(product, "productt")
// //         if (productUpdate) {
// //             return showResponse(true, 'Product Updated Successfully', productUpdate, 200);
// //         }

// //         return showResponse(false, 'Product Updation failed!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error updating product and price:', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);
// //     }
// // };

// // const deleteProductPackage = async (product_id: string) => { //interval is like month year package
// //     try {
// //         const stripe: any = await initialiseStripe();

// //         const productDelete = await stripe.products.del(product_id);
// //         // console.log(product, "productt")
// //         if (productDelete && productDelete?.deleted) {
// //             return showResponse(true, 'Product Deleted Successfully', productDelete, 200);
// //         }

// //         return showResponse(false, 'Product Deleted failed!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error Deleted product and price:', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);
// //     }
// // };

// //archive the product price so that it can not be used in future purchase or if wan to restore it set to active else false
// // const activeOrInactiveProductPrice = async (price_id: string, price_status: boolean) => { //interval is like month year package
// //     try {
// //         const stripe: any = await initialiseStripe();

// //         const priceUpdate = await stripe.prices.update(price_id, { lookup_key: 'MY_LOOKUP_KEY', active: price_status, });
// //         console.log(priceUpdate, "priceUpdate")

// //         if (priceUpdate) {
// //             return showResponse(true, 'Product Price Update Successfully', priceUpdate, 200);
// //         }

// //         return showResponse(false, 'Product Price Update failed!', null, 400);

// //     } catch (error: any) {
// //         // Handle errors
// //         console.error('Error Update product and price:', error);
// //         const errorMessage = error.raw ? error.raw.message : error.message;
// //         return showResponse(false, errorMessage, null, 400);
// //     }
// // };


// export {
//     initialiseStripe,
//     createCustomerId,
//     getPriceList,
//     getUserSubscriptionList,
//     saveCardStripe,
//     userDefaultSource,
//     purchaseSubscriptionStripe,
//     getCustomerDetails,
//     getUserSubscriptionDetail,
//     cancelUserSubscription,
//     cancelPlanTillEndPeriod,
//     saveStripeLogs,
//     saveSubscriptionWebhookLogIOS,
//     // createPaymentIntent,
//     // stripePaymentRefund,
//     // getPaymentIntent,
//     // getProductList,
//     // getPriceValue,
//     // deleteCardStripe,
//     // getSavedResourceList,
//     // getCardTokenDetails,
//     // checkDuplicateCardStripe,
//     // getCustomerCardDetails,
//     // createProductPackage,
//     // updateProductPackage,
//     // getSubscriptionProductDetails,
//     // deleteProductPackage,
//     // activeOrInactiveProductPrice
// }
