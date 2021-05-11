import { Document, Model, model, Schema } from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param userType:string
 */
export interface IUser extends Document {
  email: string;
  password: string;
  userType: string;
}

const userSchema: Schema = new Schema({
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

const User: Model<IUser> = model("User", userSchema);

export default User;
