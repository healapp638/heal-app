import joi from 'joi';

export const validateInitialPurchasedIosSubscription = (items: any) => {
    return joi.object({
        package_name: joi.string().trim().required().label('Package Name'),
        original_transaction_id: joi.string().trim().required().label('Original transaction id'),     
        signedPayload: joi.string().trim().required().label('Signed Payload')        
    }).validate(items);
};

export const validateInitialPurchasedAndroidSubscription = (items: any) => {
    return joi.object({
        plan_name: joi.string().trim().required().label('Plan name'),     
        purchase_token: joi.string().trim().required().label('Purchase token')        
    }).validate(items);
};

