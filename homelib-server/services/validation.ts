import joi from "joi"

export const Signup = joi.object({
    firstName: joi.string().alphanum().min(3),
    lastName: joi.string().alphanum().min(3),
    name: joi.string().alphanum().min(4).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(64).required()
});