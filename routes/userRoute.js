import express from "express";
import userController from "../Controller/userController.js";
const router = express.Router();
router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.AddANewUser)
  .put(userController.userController)
  .delete(userController.DeleteAUser);
export default router;
