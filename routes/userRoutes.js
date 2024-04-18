import { registerUserCtrl, loginUserCtrl } from "../controllers/userController.js";
import { Router } from "express";
const userRouter = Router();

userRouter.post('/register', registerUserCtrl)
userRouter.post('/login', loginUserCtrl)

export default userRouter