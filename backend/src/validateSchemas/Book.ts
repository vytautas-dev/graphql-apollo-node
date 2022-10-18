import Joi from "joi";

export const createAndUpdateBookValidateSchema = Joi.object({
  author: Joi.string().min(4).max(20).required(),
  title: Joi.string().min(4).max(20).required(),
  description: Joi.string().max(50).required(),
  genre: Joi.string(),
});
