"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("config"));
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const user_1 = __importDefault(require("../../validation/user"));
const router = express_1.Router();
// @route   POST api/auth/signin
// @desc    Login user and get token
// @access  Public
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sanitizeVal = yield user_1.default.validateAsync(req.body);
        const { email, password } = sanitizeVal;
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                errors: [
                    {
                        msg: "Invalid Credentials",
                    },
                ],
            });
        }
        const isMatch = yield bcryptjs_1.default.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                errors: [
                    {
                        msg: "Invalid Credentials",
                    },
                ],
            });
        }
        const payload = {
            userId: user.id,
        };
        jsonwebtoken_1.default.sign(payload, config_1.default.get("jwtSecret"), { expiresIn: config_1.default.get("jwtExpiration") }, (err, token) => {
            if (err)
                throw err;
            res.json(Object.assign({ token }, user.toObject()));
        });
    }
    catch (err) {
        if (err.isJoi) {
            res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(err.details);
            return;
        }
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   POST api/signup
// @desc    Signup user and get token
// @access  Public
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const errors = validationResult(req);
    try {
        const sanitizeVal = yield user_1.default.validateAsync(req.body);
        const { email, password } = sanitizeVal;
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            const user = new User_1.default({
                email,
                password: bcryptjs_1.default.hashSync(password, config_1.default.get("saltingRound")),
            });
            let userData = yield user.save();
            userData = userData.toObject();
            const payload = {
                userId: userData._id,
            };
            const token = yield jsonwebtoken_1.default.sign(payload, config_1.default.get("jwtSecret"), {
                expiresIn: config_1.default.get("jwtExpiration"),
            });
            res.json(Object.assign({ token }, userData));
        }
        else {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                errors: [
                    {
                        msg: "User already exist. Please signup",
                    },
                ],
            });
        }
    }
    catch (err) {
        if (err.isJoi) {
            res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(err.details);
            return;
        }
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map