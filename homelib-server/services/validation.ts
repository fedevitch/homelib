import joi from "joi"

export const Signup = joi.object({
    firstName: joi.string().alphanum().min(3).allow(''),
    lastName: joi.string().alphanum().min(3).allow(''),
    name: joi.string().alphanum().min(4).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(64).required()
});

export const Login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(64).required()
});
