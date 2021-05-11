"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    password: joi_1.default.string().min(6).max(15).required(),
    email: joi_1.default.string().email().lowercase().required(),
});
exports.default = schema;
//# sourceMappingURL=user.js.map