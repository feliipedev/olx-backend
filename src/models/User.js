
import pkg from 'mongoose';
const { Schema, model, connection } = pkg;


const schema = new Schema({
  name: String,
  email: String,
  state: String,
  passwordHash: String,
  token: String,
});

const modelName = "User";

export default (connection && connection.models[modelName])
  ? connection.models[modelName]
  : model(modelName, schema);
