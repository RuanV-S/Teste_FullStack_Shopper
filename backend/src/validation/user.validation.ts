import Joi from "joi";

export const createUserValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "any.required": "Nome é obrigatório",
    "string.empty": "Nome não pode ser vazio",
    "string.min": "Nome deve ter pelo menos {#limit} caracteres",
    "string.max": "Nome deve ter no máximo {#limit} caracteres",
  }),
  email: Joi.string().trim().min(2).max(50).required().messages({
    "any.required": "Email é obrigatório",
    "string.empty": "Email não pode ser vazio",
    "string.min": "Email deve ter pelo menos {#limit} caracteres",
    "string.max": "Email deve ter no máximo {#limit} caracteres",
  }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Senha é obrigatória",
    "string.empty": "Senha não pode ser vazia",
    "string.min": "Senha deve ter pelo menos {#limit} caracteres",
  }),
});

export const loginValidation = Joi.object({
  email: Joi.string().trim().required().messages({
    "any.required": "O email é obrigatório",
    "string.empty": "O email não pode estar vazio",
  }),
  password: Joi.string().trim().required().messages({
    "any.required": "A senha é obrigatória",
    "string.empty": "A senha não pode estar vazia",
  }),
});
