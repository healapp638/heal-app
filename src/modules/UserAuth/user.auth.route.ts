import express, { Request, Response } from 'express'
import UserAuthController from './user.auth.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
import { ratLimiting } from '../../middlewares/rate.limit.middleware'
const { verifyTokenUser } = middlewares.auth
const { multer } = middlewares.fileUpload

const router = express.Router()


router.post('/register', async (req: Request | any, res: Response) => {
    const { hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf, fullName, country, email, dob, password, language } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.register({ hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf, fullName, country, email, dob, password, language });
    return showOutput(res, result, result.code)
})

router.post('/sendMagicLink', async (req: Request | any, res: Response) => {
    const { hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, email, language } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.sendMagicLink({ hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, email, language });
    return showOutput(res, result, result.code)
})

router.post('/magicLinkLogin', async (req: Request | any, res: Response) => {
    const { email, hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, language, timeZone, code } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.magicLinkLogin({ email, hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, language, timeZone, code });
    return showOutput(res, result, result.code)
})

router.post('/toggle_biometric', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.toggleBiometric();
    return showOutput(res, result, result.code)
})

router.post('/login', ratLimiting, async (req: Request | any, res: Response) => {
    const { email, password, language, timeZone } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.login({ email, password, language, timeZone });
    return showOutput(res, result, result.code)
})

router.post('/social_login', multer.addToMulter.none(), async (req: Request | any, res: Response) => {
    const { login_source, social_auth, email, name, os_type, language, timeZone } = req.body;
    const userAuthController = new UserAuthController(req, res)
    const result: ApiResponse = await userAuthController.socialLogin(login_source, social_auth, email, name, os_type, language, timeZone);
    return showOutput(res, result, result.code)
})

router.post('/forgot_password', async (req: Request | any, res: Response) => {
    const { email } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.forgotPassword({ email });
    return showOutput(res, result, result.code)
})

router.post('/reset_password', async (req: Request | any, res: Response) => {
    const { email, new_password, otp } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.resetPassword({ email, new_password, otp });
    return showOutput(res, result, result.code)
})

router.post('/verify_otp', async (req: Request | any, res: Response) => {
    const { email, otp, password } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.verifyOtp({ email, otp, password });
    return showOutput(res, result, result.code)
})

router.post('/resend_otp', async (req: Request | any, res: Response) => {
    const { email } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.resendOtp({ email });
    return showOutput(res, result, result.code)
})


router.post('/change_password', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { old_password, new_password } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.changePassword({ old_password, new_password });
    return showOutput(res, result, result.code)
})

router.get('/details', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.getUserDetails();
    return showOutput(res, result, result.code)
})

router.post('/profile', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { fullName, country, dob, profilePic, language } = req.body
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.updateUserProfile({ fullName, country, dob, profilePic, language });
    return showOutput(res, result, result.code)
})


router.delete('/delete_deactivate', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { status, reason } = req.body
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.deleteOrDeactivateAccount({ status, reason });
    return showOutput(res, result, result.code)
})

router.post('/refresh_token', multer.addToMulter.none(), async (req: Request | any, res: Response) => {
    const { refresh_token } = req.body
    const commonController = new UserAuthController(req, res)
    const result: ApiResponse = await commonController.refreshToken(refresh_token);
    return showOutput(res, result, result.code)
})

router.post('/logout', async (req: Request | any, res: Response) => {
    const userAuthController = new UserAuthController(req, res)
    const result: ApiResponse = await userAuthController.logoutUser();
    return showOutput(res, result, result.code)
})

router.post('/upload_file', multer.addToMulter.single('file'), async (req: Request | any, res: Response) => {
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.uploadFile(req.file as Express.Multer.File);
    return showOutput(res, result, result.code)

})

router.get('/details_user', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.getUserDetailsUser();
    return showOutput(res, result, result.code)
});

router.post('/complete_onboarding', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, language } = req.body;
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.completeOnboarding({ hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, language });
    return showOutput(res, result, result.code)
})

router.get('/trialSubscription', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.userTrialSubscription();
    return showOutput(res, result, result.code)
});

router.get('/progress_tracker_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.progressTrackerList();
    return showOutput(res, result, result.code)
});

router.post('/claimStreak', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserAuthController(req, res)
    const result: ApiResponse = await controller.claimStreak();
    return showOutput(res, result, result.code)
});

export default router
