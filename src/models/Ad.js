
import pkg from 'mongoose';
const { Schema, model, connection } = pkg;


const schema = new Schema({
  idUser: String,
  state: String,
  category: String,
  images: [Object],
  dateCreated: Date,
  title: String,
  price: Number,
  priceNegotiable: Boolean,
  description: String,
  views: Number,
  status: String,
});
const modelName = "ads";

export default (connection && connection.models[modelName])
  ? connection.models[modelName]
  : model(modelName, schema);

