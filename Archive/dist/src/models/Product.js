"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    qty: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    disLikedBy: {
        type: [mongoose_1.Schema.Types.ObjectId],
        default: [],
    },
    likedBy: {
        type: [mongoose_1.Schema.Types.ObjectId],
        default: [],
    },
}, { timestamps: true });
const Product = mongoose_1.model("Product", productSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map