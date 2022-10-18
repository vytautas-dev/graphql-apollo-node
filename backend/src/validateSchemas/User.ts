import Joi from "joi";

const pattern = /^[a-zA-Z0-9]{8,30}$/;

export const userValidateSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(RegExp(pattern)).required(),
});