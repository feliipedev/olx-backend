
import pkg from 'mongoose';
const { Schema, model, connection } = pkg;


const schema = new Schema({
  name: String,
  slug: String,
});
const modelName = "Category";

export default (connection && connection.models[modelName])
  ? connection.models[modelName]
  : model(modelName, schema);
