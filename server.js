import dotenv from "dotenv";
dotenv.config();
import apiRoutes from "./src/routes/routes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;
mongoose.connection.on("error", (error) => {
  console.log("Erro: ", error.message);
});

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileUpload());

server.use(express.static(path.join(__dirname, "../public")));

server.use(apiRoutes);

server.listen(process.env.PORT, () => {
  console.log(`- RODANDO NO ENDEREÇO: ${process.env.BASE}`);
});
