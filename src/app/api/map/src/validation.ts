import Joi from "joi";

export const MapStatic = Joi.object({
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
