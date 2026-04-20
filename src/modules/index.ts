import express from 'express';
const Route = express.Router();

//admin routes
import adminAuthRoutes from '../modules/AdminAuth/admin.auth.route'
import adminCommonRoutes from '../modules/AdminCommon/admin.common.route'
import adminUserRoutes from '../modules/AdminUser/admin.user.route'
import adminContactUsRoutes from '../modules/AdminContactus/admin.contactus.route'

//user and admin all usertype common routes
import commonRoutes from '../modules/Common/common.route'

//user routes
import userAuthRoutes from '../modules/UserAuth/user.auth.route'
import userCommonRoutes from '../modules/UserCommon/user.common.route'



// *********assign order of routes for swagger in last to show on first **********


//admin routes
Route.use('/admin/common', adminCommonRoutes);
Route.use('/admin/user', adminUserRoutes);
Route.use('/admin/auth', adminAuthRoutes);
Route.use('/admin/contactus', adminContactUsRoutes);

//user routes
Route.use('/user/auth', userAuthRoutes);
Route.use('/user/common', userCommonRoutes);

//user and admin all usertype common routes
Route.use('/common', commonRoutes);

export default Route;