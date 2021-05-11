import bcrypt from "bcryptjs";
import config from "config";
import { Response, Router } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../models/User";
import Payload from "../../types/Payload";
import Request from "../../types/Request";
import UserValidation from "../../validation/user";

const router: Router = Router();

// @route   POST api/auth/signin
// @desc    Login user and get token
// @access  Public
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const sanitizeVal = await UserValidation.validateAsync(req.body);
    const { email, password } = sanitizeVal;
    let user: IUser = await User.findOne({ email });
    if (!user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Invalid Credentials",
          },
        ],
      });
    }

    const isMatch = await bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Invalid Credentials",
          },
        ],
      });
    }

    const payload: Payload = {
      userId: user.id,
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: config.get("jwtExpiration") },
      (err, token) => {
        if (err) throw err;
        res.json({ token, ...user.toObject() });
      }
    );
  } catch (err) {
    if (err.isJoi) {
      res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err.details);
      return;
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   POST api/signup
// @desc    Signup user and get token
// @access  Public
router.post("/signup", async (req: Request, res: Response) => {
  // const errors = validationResult(req);
  try {
    const sanitizeVal = await UserValidation.validateAsync(req.body);
    const { email, password } = sanitizeVal;
    let user: IUser = await User.findOne({ email });

    if (!user) {
      const user = new User({
        email,
        password: bcrypt.hashSync(password, config.get("saltingRound")),
      });
      let userData = await user.save();
      userData = userData.toObject();
      const payload: Payload = {
        userId: userData._id,
      };
      const token = await jwt.sign(payload, config.get("jwtSecret"), {
        expiresIn: config.get("jwtExpiration"),
      });
      res.json({ token, ...userData });
    } else {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "User already exist. Please signup",
          },
        ],
      });
    }
  } catch (err) {
    if (err.isJoi) {
      res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err.details);
      return;
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
