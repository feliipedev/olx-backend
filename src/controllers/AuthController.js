import { validationResult, matchedData } from "express-validator";
import User from "../models/User.js";
import State from "../models/State.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ error: errors.mapped() });
    return;
  }
  const data = matchedData(req);

  //validando o email
  const user = await User.findOne({ emai: data.email });
  if (!user) {
    res.json({
      error: { emai: { msg: "E-mail ou senha errados!" } },
    });
    return;
  }

  //validando a senha
  const match = await bcrypt.compare(data.password, user.passwordHash);
  if (!match) {
    res.json({
      error: { emai: { msg: "E-mail ou senha errados!" } },
    });
    return;
  }

  const payload = (Date.now() + Math.random()).toString();
  const token = await bcrypt.hash(payload, 10);

  user.token = token
  await user.save()

  res.json({token, email: data.email});
};

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ error: errors.mapped() });
    return;
  }
  const data = matchedData(req);
  // verificanado se email existe
  const user = await User.findOne({
    email: data.email,
  });
  if (user) {
    res.json({
      error: { emai: { msg: "E-mail já existe!" } },
    });
    return;
  }

  //verificando se estado existe
  if (mongoose.Types.ObjectId.isValid(data.state)) {
    const stateItem = await State.findById(data.state);
    if (!stateItem) {
      res.json({
        error: { state: { msg: "Estado não existe!" } },
      });
      return;
    }
  } else {
    res.json({
      error: { state: { msg: "Código de estado inválido!" } },
    });
    return;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const payload = (Date.now() + Math.random()).toString();
  const token = await bcrypt.hash(payload, 10);

  const newUser = new User({
    name: data.name,
    email: data.email,
    passwordHash,
    token,
    state: data.state,
  });

  await newUser.save();
  res.json({ token });
};
