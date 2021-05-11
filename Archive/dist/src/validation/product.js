"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    title: joi_1.default.string().min(6).max(15).required(),
    description: joi_1.default.string().max(300).lowercase().required(),
    qty: joi_1.default.number().required(),
    price: joi_1.default.number().required(),
});
const likeSchema = joi_1.default.object({
    productId: joi_1.default.string().required(),
});
exports.likeSchema = likeSchema;
exports.default = schema;
//# sourceMappingURL=product.js.map