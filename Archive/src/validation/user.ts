import Joi from "joi";

const schema = Joi.object({
  password: Joi.string().min(6).max(15).required(),
  email: Joi.string().email().lowercase().required(),
});

export default schema;
