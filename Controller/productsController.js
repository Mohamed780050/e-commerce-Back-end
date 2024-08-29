import connectTo from "../middlewares/mongoConnection.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
dotenv.config();
const DbLink = process.env.DbLink;
async function getAllProduct(req, res) {
  try {
    const MyDb = await connectTo(DbLink, "E-commerce", "Products");
    const Products = await MyDb.find({}).toArray();
    res.json({ Products: Products });
  } catch (err) {
    console.log(err);
  }
}
async function AddANewProduct(req, res) {
  try {
    const { title, description, price, img, stock, Owner, catagory, company } =
      req.body;
    if (
      !title ||
      !description ||
      !price ||
      !img ||
      !stock ||
      !Owner ||
      !catagory ||
      !company
    )
      return res.status(400).json({ message: "All fields are required" });
    const MyDb = await connectTo(DbLink, "E-commerce", "Products");
    await MyDb.insertOne({
      title: title,
      description: description,
      price: price,
      img: img,
      stock: stock,
      Owner: Owner,
      catagory: catagory,
      company: company,
    });
    res.json({ message: `${title} is added` });
  } catch (err) {
    console.log(err);
  }
}
async function UpdateAProduct(req, res) {
  try {
    const {
      id,
      newtitle,
      newdescription,
      newprice,
      newimg,
      newstock,
      newcatagory,
      newcompany,
    } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });
    const MyDb = await connectTo(DbLink, "E-commerce", "Products");
    const Product = await MyDb.findOne({ _id: new ObjectId(`${id}`) });
    if (!Product)
      return res.status(400).json({ message: "Did not find the Product" });
    await MyDb.updateOne(
      { _id: new ObjectId(`${id}`) },
      {
        $set: {
          title: newtitle ? newtitle : Product.title,
          description: newdescription ? newdescription : Product.description,
          price: newprice ? newprice : Product.price,
          img: newimg ? newimg : Product.img,
          stock: newstock ? newstock : Product.stock,
          catagory: newcatagory ? newcatagory : Product.catagory,
          company: newcompany ? newcompany : Product.company,
        },
      }
    );
    return res.json({ message: "Product updated" });
  } catch (err) {
    console.log(err);
  }
}
async function DeleteAProduct(req, res) {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });
    const MyDb = await connectTo(DbLink, "E-commerce", "Products");
    const Product = await MyDb.findOne({ _id: new ObjectId(`${id}`) });
    if (!Product) return res.json({ message: "checkout your ID" });
    await MyDb.deleteOne({ _id: new ObjectId(`${id}`) });
    res.json({ message: `${Product.title} is deleted` });
  } catch (err) {
    console.log(err);
  }
}
export default {
  getAllProduct,
  AddANewProduct,
  UpdateAProduct,
  DeleteAProduct,
};
