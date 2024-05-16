import express from 'express';
 import multer from "multer";
 import {verifyUser} from "../controllers/userController.js"
import { addTransactionController, deleteTransactionController, getAllTransactionController, updateTransactionController } from '../controllers/transactionController.js';
const upload = multer({ dest: 'uploads/' })
const router = express.Router();

router.route("/addTransaction").post(upload.single('image'), verifyUser, addTransactionController);

router.route("/getTransaction").post(verifyUser, getAllTransactionController);

router.route("/deleteTransaction/:id").post(verifyUser, deleteTransactionController);

router.route('/updateTransaction/:id').put(verifyUser, updateTransactionController);

export default router;