import { Router } from "express";
const router = Router();
import * as AdsController from "../controllers/AdsController.js";
import * as UserController from "../controllers/UserController.js";
import * as AuthController from "../controllers/AuthController.js";
import * as Auth from "../middlewares/Auth.js";
import * as AuthValidator from "../validators/AuthValidator.js";
import * as UserValidator from "../validators/UserValidator.js";

router.get("/ping", (req, res) => {
  res.json({ pong: true });
});

router.get("/states", UserController.getStates);

router.post("/user/signin", AuthValidator.signin, AuthController.signin);
router.post("/user/signup", AuthValidator.signup, AuthController.signup);

router.get("/user/me", Auth.privado, UserController.info);
router.put(
  "/user/me",
  UserValidator.editAction,
  Auth.privado,
  UserController.editAction
);

router.get("/categories", AdsController.getCategories);

router.post("/ad/add", Auth.privado, AdsController.addAction);
router.get("/ad/list", AdsController.getList);
router.get("/ad/item", AdsController.getItem);
router.post("/ad/:id", Auth.privado, AdsController.editAction);

export default router;
