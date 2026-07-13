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
exports.saveNotification = exports.findValueAndIncrement = exports.findAndUpdatePushOrSet = exports.getCount = exports.findAll = exports.addItemInArray = exports.bulkOperationQuery = exports.removeItemFromArray = exports.findByIdAndRemove = exports.findOneAndDelete = exports.deleteMany = exports.updateMany = exports.findByIdAndUpdate = exports.findOneAndUpdate = exports.insertMany = exports.createOne = exports.findOne = void 0;
const response_util_1 = require("../utils/response.util");
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const user_notification_model_1 = __importDefault(require("../modules/Notification/user.notification.model"));
const findOne = (Model, queryObject, fields = {}, populate) => {
    return new Promise((resolve) => {
        let queryBuilder = Model.findOne(queryObject, fields);
        if (populate) {
            queryBuilder = queryBuilder.populate(populate);
        }
        queryBuilder.exec()
            .then(data => {
            if (!data) {
                const response = (0, response_util_1.showResponse)(false, 'Data Retrieval Failed', 'error occured');
                resolve(response);
            }
            else {
                const doc = data === null || data === void 0 ? void 0 : data.toObject();
                const response = (0, response_util_1.showResponse)(true, 'Data Found', doc);
                resolve(response);
            }
        })
            .catch((err) => {
            const response = (0, response_util_1.showResponse)(false, 'Data Retrieval Failed', err);
            resolve(response);
        });
    });
};
exports.findOne = findOne;
const createOne = (modalReference) => {
    return new Promise((resolve) => {
        modalReference.save()
            .then((savedData) => {
            const doc = savedData === null || savedData === void 0 ? void 0 : savedData.toObject();
            const response = (0, response_util_1.showResponse)(true, 'Data Saved Successfully', doc);
            resolve(response);
        })
            .catch((err) => {
            const response = (0, response_util_1.showResponse)(false, 'Data Save Failed', err);
            resolve(response);
        });
    });
};
exports.createOne = createOne;
const insertMany = (Model, dataArray) => {
    return new Promise((resolve) => {
        Model.insertMany(dataArray)
            .then(data => {
            const response = (0, response_util_1.showResponse)(true, 'Success', data);
            resolve(response);
        })
            .catch(err => {
            const response = (0, response_util_1.showResponse)(false, 'Data Save Failed', err);
            resolve(response);
        });
    });
};
exports.insertMany = insertMany;
const findOneAndUpdate = (Model, queryObject, updateObj, upsert = false) => {
    return new Promise((resolve) => {
        Model.findOneAndUpdate(queryObject, { $set: updateObj }, { new: true, upsert: upsert })
            .then(updatedData => {
            if (updatedData) {
                const doc = updatedData === null || updatedData === void 0 ? void 0 : updatedData.toObject();
                const response = (0, response_util_1.showResponse)(true, 'Success', doc);
                resolve(response);
            }
            else {
                const response = (0, response_util_1.showResponse)(false, 'Failed', null);
                resolve(response);
            }
        })
            .catch(err => {
            const response = (0, response_util_1.showResponse)(false, 'Failed error', err);
            resolve(response);
        });
    });
};
exports.findOneAndUpdate = findOneAndUpdate;
const findByIdAndUpdate = (Model, _id, updateObj) => {
    return new Promise((resolve) => {
        Model.findByIdAndUpdate(_id, { $set: updateObj }, { new: true })
            .then(updatedData => {
            const doc = updatedData === null || updatedData === void 0 ? void 0 : updatedData.toObject();
            const response = (0, response_util_1.showResponse)(true, 'Success', doc);
            resolve(response);
        })
            .catch(err => {
            const response = (0, response_util_1.showResponse)(false, 'Failed', err);
            resolve(response);
        });
    });
};
exports.findByIdAndUpdate = findByIdAndUpdate;
const updateMany = (Model, queryObject, updateObj) => {
    return new Promise((resolve) => {
        Model.updateMany(queryObject, { $set: updateObj }, { multi: true, new: true }).lean()
            .exec()
            .then((updatedData) => {
            const response = (0, response_util_1.showResponse)(true, 'Success', updatedData);
            return resolve(response);
        })
            .catch((err) => {
            const response = (0, response_util_1.showResponse)(false, err);
            return resolve(response);
        });
    });
};
exports.updateMany = updateMany;
const deleteMany = (Model, queryObject) => {
    return new Promise((resolve) => {
        Model.deleteMany(queryObject)
            .then(() => {
            const response = (0, response_util_1.showResponse)(true, 'Success');
            resolve(response);
        })
            .catch((err) => {
            const response = (0, response_util_1.showResponse)(false, 'Failed', err);
            resolve(response);
        });
    });
};
exports.deleteMany = deleteMany;
const findOneAndDelete = (Model, queryObject) => {
    return new Promise((resolve) => {
        Model.findOneAndDelete(queryObject)
            .lean()
            .then(result => {
            if (!result) {
                const response = (0, response_util_1.showResponse)(false, 'Failed', null);
                resolve(response);
            }
            else {
                const response = (0, response_util_1.showResponse)(true, 'Success', result);
                resolve(response);
            }
        })
            .catch(err => {
            const response = (0, response_util_1.showResponse)(false, 'Failed', err);
            resolve(response);
        });
    });
};
exports.findOneAndDelete = findOneAndDelete;
const findByIdAndRemove = (Model, _id) => {
    return new Promise((resolve) => {
        Model.findOneAndDelete({ _id: _id })
            .lean()
            .then(result => {
            if (!result) {
                const response = (0, response_util_1.showResponse)(false, 'Failed', null);
                resolve(response);
            }
            else {
                const response = (0, response_util_1.showResponse)(true, 'Success', result);
                resolve(response);
            }
        })
            .catch(err => {
            const response = (0, response_util_1.showResponse)(false, 'Failed', err);
            resolve(response);
        });
    });
};
exports.findByIdAndRemove = findByIdAndRemove;
//example how to use
//  let result = await removeItemFromArray(ModelName, { _id: sizeCategoryId }, 'parameters', sizeParamId)
//1st param  =>> model 
//2nd param =>> main Object Id
//3rd param =>> array feild name 
//4th param =>> match condition objectId that you want to delete in array of object  
const removeItemFromArray = (Model, mainIdObj, arrayKey, itemIdObj) => {
    return Model.updateOne(mainIdObj, { $pull: { [arrayKey]: itemIdObj } }).lean()
        .then((updatedData) => {
        if ((updatedData === null || updatedData === void 0 ? void 0 : updatedData.modifiedCount) && updatedData.modifiedCount > 0) {
            return (0, response_util_1.showResponse)(true, 'Success', updatedData);
        }
        else {
            return (0, response_util_1.showResponse)(false, 'Update failed', {});
        }
    })
        .catch((err) => {
        return (0, response_util_1.showResponse)(false, err, {});
    });
};
exports.removeItemFromArray = removeItemFromArray;
const bulkOperationQuery = (Model, bulkOperations) => {
    return new Promise((resolve) => {
        Model.bulkWrite(bulkOperations)
            .then(result => {
            if ((result === null || result === void 0 ? void 0 : result.ok) === 1) {
                const response = (0, response_util_1.showResponse)(true, 'Success', result);
                resolve(response);
            }
            else {
                const response = (0, response_util_1.showResponse)(false, 'Failed', result);
                resolve(response);
            }
        })
            .catch(err => {
            const response = (0, response_util_1.showResponse)(false, err.message || err);
            resolve(response);
        });
    });
};
exports.bulkOperationQuery = bulkOperationQuery;
//example how to use
// let result = await addItemInArray(ModelName, matchObj, 'parameters', parameters)
//1st param  =>> model 
//2nd param =>> main Object Id
//3rd param =>> array feild name 
//4th param =>> object that you want to add in array of object  
const addItemInArray = (Model, mainIdObj, arrayKey, itemToAddObj) => {
    return Model.updateOne(mainIdObj, { $push: { [arrayKey]: itemToAddObj } })
        .then((updatedData) => {
        if ((updatedData === null || updatedData === void 0 ? void 0 : updatedData.modifiedCount) && updatedData.modifiedCount > 0) {
            return (0, response_util_1.showResponse)(true, 'Success', updatedData);
        }
        else {
            return (0, response_util_1.showResponse)(false, 'Update failed', {});
        }
    })
        .catch((err) => {
        return (0, response_util_1.showResponse)(false, err, {});
    });
};
exports.addItemInArray = addItemInArray;
const findAll = (Model, queryObject, project_field, pagination, sort, populate) => {
    return new Promise((resolve) => {
        let queryBuilder = Model.find(queryObject, project_field);
        if (pagination) {
            queryBuilder = queryBuilder.limit(pagination);
        }
        if (populate) {
            queryBuilder = queryBuilder.populate(populate);
        }
        if (sort) {
            queryBuilder = queryBuilder.sort(sort);
        }
        // Enable lean and virtuals
        // queryBuilder = queryBuilder.lean({ virtuals: true });
        queryBuilder.exec()
            .then(data => {
            if (!data || data.length === 0) {
                const response = (0, response_util_1.showResponse)(false, "No data found");
                resolve(response);
            }
            else {
                const response = (0, response_util_1.showResponse)(true, "Data found", data);
                resolve(response);
            }
        })
            .catch(err => {
            const response = (0, response_util_1.showResponse)(false, err);
            resolve(response);
        });
    });
};
exports.findAll = findAll;
const getCount = (Model, queryObject) => {
    return new Promise((resolve) => {
        Model.countDocuments(queryObject).then((result) => {
            const response = (0, response_util_1.showResponse)(true, 'Success', result, statusCodes_1.default.SUCCESS);
            resolve(response);
        }).catch((err) => {
            const response = (0, response_util_1.showResponse)(false, 'Failed', err, statusCodes_1.default.API_ERROR);
            resolve(response);
        });
    });
};
exports.getCount = getCount;
//examp edit obj -- >> { $push: { tax_filing: { $each: tax_filing } } }
//let response = await findAndUpdatePushOrSet(model, { _id: findUser.data._id }, editObj); //edit obj is object that you want to push in array 
const findAndUpdatePushOrSet = (Model, queryObject, updateMethodWithObject) => {
    return Model.findOneAndUpdate(queryObject, updateMethodWithObject, { new: true })
        .lean() // return plain object
        .then((updatedData) => {
        if (updatedData) {
            return (0, response_util_1.showResponse)(true, 'Success', updatedData);
        }
        else {
            return (0, response_util_1.showResponse)(false, 'Failed', null);
        }
    })
        .catch((err) => {
        return (0, response_util_1.showResponse)(false, 'Failed error', err);
    });
};
exports.findAndUpdatePushOrSet = findAndUpdatePushOrSet;
// { fieldNameToIncrement: 1 },  1 for increment -1 for decrement
const findValueAndIncrement = (Model, queryObject, incObjectWithValue) => {
    return new Promise((resolve) => {
        Model.findOneAndUpdate(queryObject, { $inc: incObjectWithValue }, { returnOriginal: true }) //Return the updated document
            .then(updatedData => {
            if (updatedData) {
                const doc = updatedData === null || updatedData === void 0 ? void 0 : updatedData.toObject();
                const response = (0, response_util_1.showResponse)(true, 'Success', doc);
                resolve(response);
            }
            else {
                const response = (0, response_util_1.showResponse)(false, 'Failed', null);
                resolve(response);
            }
        })
            .catch(err => {
            const response = (0, response_util_1.showResponse)(false, 'Failed error', err);
            resolve(response);
        });
    });
};
exports.findValueAndIncrement = findValueAndIncrement;
const saveNotification = (from, to, title, message, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const obj = { title, message, from, to, type };
        const ref = new user_notification_model_1.default(obj);
        const result = yield (0, exports.createOne)(ref);
        if (result.status) {
            return (0, response_util_1.showResponse)(true, 'Notification Saved Successfully', result === null || result === void 0 ? void 0 : result.data, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, 'Notification Failed to saved', null, statusCodes_1.default.API_ERROR);
    }
    catch (error) {
        return (0, response_util_1.showResponse)(false, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error, null, statusCodes_1.default.API_ERROR);
    }
}); //ends
exports.saveNotification = saveNotification;
