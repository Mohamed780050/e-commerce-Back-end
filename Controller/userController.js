import connectTo from "../middlewares/mongoConnection.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
dotenv.config();
const DbLink = process.env.DbLink;
async function getAllUser(req, res) {
  try {
    const MyDb = await connectTo(DbLink, "E-commerce", "Users");
    const users = await MyDb.find({}).toArray();
    res.json({ data: users });
  } catch (err) {
    console.log(err);
  }
}
async function AddANewUser(req, res) {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email)
      return res.status(400).json({ message: "All fields are required" });
    const MyDb = await connectTo(DbLink, "E-commerce", "Users");
    const checkout = await MyDb.findOne({
      $or: [{ username: username, email: email }],
    });
    if (checkout)
      return res
        .status(400)
        .json({ message: "The Username or the Email is oready taken" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await MyDb.insertOne({
      username: username,
      password: hashedPassword,
      email: email,
    });
    res.json({ message: `You Singed up` });
  } catch (err) {
    console.log(err);
  }
}
async function UpdateAUser(req, res) {
  try {
    const { id, password, newpassword } = req.body;
    if (!id || !password || !newpassword)
      return res.status(400).json({ message: "All Fields are required" });
    const MyDb = await connectTo(DbLink, "E-commerce", "Users");
    const checkoutUser = await MyDb.findOne({ _id: new ObjectId(`${id}`) });
    if (!checkoutUser)
      return res.status(400).json({ message: "Did not find the user" });
    const checkoutPassword = await bcrypt.compare(
      password,
      checkoutUser.password
    );
    if (newpassword === password)
      return res.status(400).json({ message: "Stop fooling around" });
    if (!checkoutPassword) {
      res.status(400).json({ message: "checkout Your passworld" });
    }
    const newHashedPassword = await bcrypt.hash(newpassword, 10);
    await MyDb.updateOne(
      { _id: new ObjectId(`${id}`) },
      { $set: { password: newHashedPassword } }
    );
    return res.json({ message: "Password updated" });
  } catch (err) {
    console.log(err);
  }
}
async function DeleteAUser(req, res) {
  try {
    const { id, password } = req.body;
    if (!id || !password)
      return res.status(400).json({ message: "All Fields Are required" });
    const MyDb = await connectTo(DbLink, "E-commerce", "Users");
    const checkoutUser = await MyDb.findOne({ _id: new ObjectId(`${id}`) });
    if (!checkoutUser) return res.json({ message: "checkout your inputs" });
    await MyDb.deleteOne({ _id: new ObjectId(`${id}`) });
    res.json({ message: `${checkoutUser.username} is deleted` });
  } catch (err) {
    console.log(err);
  }
}
export default { getAllUser, AddANewUser, UpdateAUser, DeleteAUser };
