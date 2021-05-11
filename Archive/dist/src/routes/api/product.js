"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const Product_1 = __importDefault(require("../../models/Product"));
const product_1 = __importStar(require("../../validation/product"));
const router = express_1.Router();
// @route   POST api/product/like
// @desc    API to like the product data
// @access  Private
router.post("/like", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sanitizeVal = yield product_1.likeSchema.validateAsync(req.body);
        const { productId } = req.body;
        const data = yield Product_1.default.findOneAndUpdate({ _id: mongoose_1.default.Types.ObjectId(productId) }, {
            $pull: { disLikedBy: mongoose_1.default.Types.ObjectId(req.userId) },
            $addToSet: { likedBy: mongoose_1.default.Types.ObjectId(req.userId) },
        }, { new: true });
        res.json(data);
    }
    catch (err) {
        if (err.isJoi) {
            res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(err.details);
            return;
        }
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   POST api/product/dislike
// @desc    API to dislike the product data
// @access  Private
router.post("/dislike", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sanitizeVal = yield product_1.likeSchema.validateAsync(req.body);
        const { productId } = req.body;
        const data = yield Product_1.default.findOneAndUpdate({ _id: mongoose_1.default.Types.ObjectId(productId) }, {
            $pull: { likedBy: mongoose_1.default.Types.ObjectId(req.userId) },
            $addToSet: { disLikedBy: mongoose_1.default.Types.ObjectId(req.userId) },
        }, { new: true });
        res.json(data);
    }
    catch (err) {
        if (err.isJoi) {
            res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(err.details);
            return;
        }
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   POST api/product/create
// @desc    Create Product
// @access  Private
router.post("/create", [auth_1.default], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Build profile object based on IProfile
    try {
        const sanitizeVal = yield product_1.default.validateAsync(req.body);
        const { title, description, qty, price } = sanitizeVal;
        // Create
        const product = new Product_1.default({
            title,
            description,
            qty,
            price,
            createdBy: req.userId,
        });
        const productDate = yield product.save();
        res.json(productDate);
    }
    catch (err) {
        if (err.isJoi) {
            res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(err.details);
            return;
        }
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   GET api/product/wishlist
// @desc    Get all user wishlist product
// @access  Public
router.get("/wishlist", [auth_1.default], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Product_1.default.aggregate([
            {
                $match: {
                    likedBy: { $in: [mongoose_1.default.Types.ObjectId(req.userId)] },
                },
            },
        ]);
        res.json(data);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
}));
// @route   GET api/product
// @desc    Get all product
// @access  Public
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, size = 10, sortBy = "createdAt", sortType = 1, } = req.query;
        const $skip = (page - 1) * size;
        const profiles = yield Product_1.default.aggregate([
            { $sort: { [`${sortBy}`]: sortType } },
            { $skip },
            { $limit: size },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdUser",
                },
            },
            {
                $project: {
                    _id: 1,
                    disLikedBy: 1,
                    likedBy: 1,
                    title: 1,
                    description: 1,
                    qty: 1,
                    price: 1,
                    "createdUser.email": 1,
                },
            },
        ]);
        res.json(profiles);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
exports.default = router;
//# sourceMappingURL=product.js.map