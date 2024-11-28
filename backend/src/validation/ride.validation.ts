import Joi from "joi";

export const calculateEstimation = Joi.object({
  customer_id: Joi.string().uuid().required().messages({
    "any.required": "O campo 'customer_id' é obrigatório",
    "string.empty": "O campo 'customer_id' não pode estar em branco",
  }),
  origin: Joi.string().trim().required().messages({
    "any.required": "O campo 'origin' é obrigatório",
    "string.empty": "O campo 'origin' não pode estar em branco",
  }),
  destination: Joi.string()
    .required()
    .custom((value, helpers) => {
      const { origin } = helpers.state.ancestors[0];
      if (value === origin) {
        return helpers.error("any.only");
      }
      return value;
    })
    .messages({
      "any.required": "O campo de 'destination' é obrigatório",
      "string.empty": "O campo de 'destination' não pode estar em branco",
      "any.only": "O campo de 'destination' não pode ser igual ao da origem",
    }),
});

export const confirmRide = Joi.object({
  customer_id: Joi.string().uuid().required().messages({
    "any.required": "O campo id do usuário é obrigatório",
    "string.empty": "O campo id do usuário não pode estar em branco",
  }),
  origin: Joi.string().trim().required().messages({
    "any.required": "O campo id do origem é obrigatório",
    "string.empty": "O campo id do origem não pode estar em branco",
  }),
  destination: Joi.string()
    .required()
    .custom((value, helpers) => {
      const { origin } = helpers.state.ancestors[0];
      if (value === origin) {
        return helpers.error("any.only");
      }
      return value;
    })
    .messages({
      "any.required": "O campo de destino é obrigatório",
      "string.empty": "O campo de destino não pode estar em branco",
      "any.only": "O campo de destino não pode ser igual ao da origem",
    }),
  distance: Joi.number().required().messages({
    "any.required": "O campo 'distance' é obrigatório",
    "string.empty": "O campo 'distance' não pode estar em branco",
  }),
  duration: Joi.string().trim().required().messages({
    "any.required": "O campo 'duration' é obrigatório",
    "string.empty": "O campo 'duration' não pode estar em branco",
  }),
  driver: Joi.object({
    id: Joi.number().required().messages({
      "any.required": "O campo 'id' do motorista é obrigatório",
      "number.base": "O campo 'id' do motorista deve ser um número",
    }),
    name: Joi.string().trim().required().messages({
      "any.required": "O campo 'name' do motorista é obrigatório",
      "string.base": "O campo 'name' do motorista deve ser uma string",
      "string.empty": "O campo 'name' do motorista não pode estar vazio",
    }),
  })
    .required()
    .messages({
      "any.required": "O campo 'driver' é obrigatório",
    }),
  value: Joi.number().required().messages({
    "any.required": "O campo 'id' do motorista é obrigatório",
    "number.base": "O campo 'id' do motorista deve ser um número",
  }),
});

export const getRide = Joi.object({
  customer_id: Joi.string().uuid().required().messages({
    "any.required": "O campo 'customer_id' é obrigatório",
    "string.empty": "O campo 'customer_id' não pode estar em branco",
  }),
});
