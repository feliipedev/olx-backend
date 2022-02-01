import State from "../models/State.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Ad from "../models/Ad.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult, matchedData } from "express-validator";

export const getStates = async (req, res) => {
  let states = await State.find();
  res.json({
    states,
  });
};

export const info = async (req, res) => {
  let { token } = req.query;

  const user = await User.findOne({
    token,
  });
  const state = await State.findById(user.state);
  const ads = await Ad.find({ idUser: user._id.toString() });
  let adList = [];
  for (let i in ads) {
    const cat = await Category.findById(ads[i].category);
    adList.push({ ...ads[i], category: cat.slug });
  }

  res.json({
    name: user.name,
    email: user.email,
    state: state.name,
    ads: adList,
  });
};

export const editAction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ error: errors.mapped() });
    return;
  }
  const data = matchedData(req);

  const user = await User.findOne({ token: data.token });

  let updates = {};
  if (data.name) {
    updates.name = data.name;
  }
  if (data.email) {
    const emailCheck = await User.findOne({ email: data.email });
    if (emailCheck) {
      res.json({ error: "E-mail já existente" });
      return;
    }
    updates.email = data.email;
  }

  if (data.state) {
    if (mongoose.Types.ObjectId.isValid(data.state)) {
      const stateCheck = await State.findById(data.state);
      if (!stateCheck) {
        res.json({ error: "Estado não existe" });
        return;
      }
      updates.state = data.state;
    }else{
      res.json({ error: "Id inválido" });
      return;
    }
  }

  if (data.password) {
    updates.passwordHash = await bcrypt.hash(data.password, 10);
  }

  await User.findOneAndUpdate({ token: data.token }, { $set: updates });
  res.json({});
};
