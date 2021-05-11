"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default: "CUSTOMER",
    },
});
const User = mongoose_1.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map