import pkg from 'mongoose';
const { Schema, model, connection } = pkg;


const schema = new Schema({
  name: String,
});

const modelName = "State";

export default (connection && connection.models[modelName])
  ? connection.models[modelName]
  : model(modelName, schema);
