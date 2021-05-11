import Joi from "joi";

const schema = Joi.object({
  title: Joi.string().min(6).max(15).required(),
  description: Joi.string().max(300).lowercase().required(),
  qty: Joi.number().required(),
  price: Joi.number().required(),
});

const likeSchema = Joi.object({
  productId: Joi.string().required(),
});

export default schema;

export { likeSchema };
