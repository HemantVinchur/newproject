const { Joi, celebrate } = require('celebrate');

const signupReqValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
    })
})

const signinReqValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
})


module.exports = { signupReqValidator, signinReqValidator }