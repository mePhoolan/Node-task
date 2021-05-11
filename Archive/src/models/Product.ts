import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./User";

/**
 * Interface to model the Product Schema for TypeScript.
 * @param createdBy:ref => User._id
 * @param title:string
 * @param description:string
 * @param qty:number
 * @param price:number
 */
export interface IProduct extends Document {
  createdBy: IUser["_id"];
  title: string;
  description: string;
  likedBy: IUser["_id"][];
  disLikedBy: IUser["_id"][];
  qty: number;
  price: number;
}

const productSchema: Schema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
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
      type: [Schema.Types.ObjectId],
      default: [],
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = model("Product", productSchema);

export default Product;
