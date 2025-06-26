import Joi from 'joi';

export const customerSchema = Joi.object({
  packageName: Joi.string().required(),
  packageDate: Joi.date().required(),
});
