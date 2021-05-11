"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productReaction = new mongoose_1.Schema({
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
}, { timestamps: true });
const ProductReaction = mongoose_1.model("ProductReaction", productReaction);
exports.default = ProductReaction;
//# sourceMappingURL=ProductReaction.js.map