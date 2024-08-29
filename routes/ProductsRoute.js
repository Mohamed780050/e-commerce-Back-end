import express from "express";
import productControll from "../Controller/productsController.js";
const router = express.Router();
router
  .route("/")
  .get(productControll.getAllProduct)
  .post(productControll.AddANewProduct)
  .put(productControll.UpdateAProduct)
  .delete(productControll.DeleteAProduct);
export default router;
