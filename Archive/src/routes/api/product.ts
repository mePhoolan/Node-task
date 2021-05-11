import { Response, Router } from "express";
import HttpStatusCodes from "http-status-codes";
import Mongoose from "mongoose";
import auth from "../../middleware/auth";
import Product from "../../models/Product";
import Request from "../../types/Request";
import ProductValidation, { likeSchema } from "../../validation/product";

const router: Router = Router();

// @route   POST api/product/like
// @desc    API to like the product data
// @access  Private
router.post("/like", auth, async (req: Request, res: Response) => {
  try {
    const sanitizeVal = await likeSchema.validateAsync(req.body);

    const { productId } = req.body;
    const data = await Product.findOneAndUpdate(
      { _id: Mongoose.Types.ObjectId(productId) },
      {
        $pull: { disLikedBy: Mongoose.Types.ObjectId(req.userId) },
        $addToSet: { likedBy: Mongoose.Types.ObjectId(req.userId) },
      },
      { new: true }
    );
    res.json(data);
  } catch (err) {
    if (err.isJoi) {
      res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err.details);
      return;
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   POST api/product/dislike
// @desc    API to dislike the product data
// @access  Private
router.post("/dislike", auth, async (req: Request, res: Response) => {
  try {
    const sanitizeVal = await likeSchema.validateAsync(req.body);
    const { productId } = req.body;
    const data = await Product.findOneAndUpdate(
      { _id: Mongoose.Types.ObjectId(productId) },
      {
        $pull: { likedBy: Mongoose.Types.ObjectId(req.userId) },
        $addToSet: { disLikedBy: Mongoose.Types.ObjectId(req.userId) },
      },
      { new: true }
    );
    res.json(data);
  } catch (err) {
    if (err.isJoi) {
      res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err.details);
      return;
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   POST api/product/create
// @desc    Create Product
// @access  Private
router.post("/create", [auth], async (req: Request, res: Response) => {
  // Build profile object based on IProfile
  try {
    const sanitizeVal = await ProductValidation.validateAsync(req.body);
    const { title, description, qty, price } = sanitizeVal;
    // Create
    const product = new Product({
      title,
      description,
      qty,
      price,
      createdBy: req.userId,
    });

    const productDate = await product.save();

    res.json(productDate);
  } catch (err) {
    if (err.isJoi) {
      res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err.details);
      return;
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/product/wishlist
// @desc    Get all user wishlist product
// @access  Public
router.get("/wishlist", [auth], async (req: Request, res: Response) => {
  try {
    const data = await Product.aggregate([
      {
        $match: {
          likedBy: { $in: [Mongoose.Types.ObjectId(req.userId)] },
        },
      },
    ]);
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
});

// @route   GET api/product
// @desc    Get all product
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      size = 10,
      sortBy = "createdAt",
      sortType = 1,
    } = req.query;

    const $skip: number = ((page as number) - 1) * (size as number);
    const profiles = await Product.aggregate([
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
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
