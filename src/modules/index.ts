import express from 'express';
const Route = express.Router();

//admin routes
import adminAuthRoutes from '../modules/AdminAuth/admin.auth.route'
import adminCommonRoutes from '../modules/AdminCommon/admin.common.route'
import adminUserRoutes from '../modules/AdminUser/admin.user.route'
import adminContactUsRoutes from '../modules/AdminContactus/admin.contactus.route'
import adminThemeRoutes from './AdminTheme/admin.theme.route'
import adminModulesRoutes from './AdminModules/admin.modules.route'
import adminSubModulesRoutes from './AdminSubModules/admin.submodules.route'
import adminPhasesRoutes from './AdminPhases/admin.phases.route'
import adminExerciseRoutes from './AdminExercise/admin.exercise.route';
import userModulesRoutes from './UserModules/user.modules.route';
import userJournelRoutes from './UserJournel/user.journal.route';
import userChallengesRoutes from './UserChallenges/user.challenges.route';


//user and admin all usertype common routes
import commonRoutes from '../modules/Common/common.route'

//user routes
import userAuthRoutes from '../modules/UserAuth/user.auth.route'
import userCommonRoutes from '../modules/UserCommon/user.common.route'
import userAffirmationRoutes from '../modules/UserAffirmation/user.affirmation.route'


// *********assign order of routes for swagger in last to show on first **********


//admin routes
Route.use('/admin/common', adminCommonRoutes);
Route.use('/admin/user', adminUserRoutes);
Route.use('/admin/auth', adminAuthRoutes);
Route.use('/admin/contactus', adminContactUsRoutes);
Route.use('/admin/theme', adminThemeRoutes);
Route.use('/admin/modules', adminModulesRoutes);
Route.use('/admin/submodules', adminSubModulesRoutes);
Route.use('/admin/phases', adminPhasesRoutes);
Route.use('/admin/exercise', adminExerciseRoutes);


//user routes
Route.use('/user/auth', userAuthRoutes);
Route.use('/user/common', userCommonRoutes);
Route.use('/user/modules', userModulesRoutes);
Route.use('/user/journal', userJournelRoutes);
Route.use('/user/challenges', userChallengesRoutes);
Route.use('/user/affirmation',userAffirmationRoutes)

//user and admin all usertype common routes
Route.use('/common', commonRoutes);

export default Route;