const joi = require("joi");

const registerValidation = (data) => {
    const schema = joi.object().keys({
        email: joi.string().required().email(),
        password: joi
            .string()
            .pattern(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-!#$@%^&*()_+|~=`{}:;'<>?,.\\\[\]\/])(?=\S+$).{6,}$/
            )
            .required()
            .messages({
                "string.pattern.base": `Le mot de passe ne correspond pas au modèle demandé (minimum 6 caractères contenant au moins : 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et 1 caractère spécial (@#$%^&-+=())`,
            }),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = joi.object().keys({
        identifier: joi.string().max(50).required(),
        password: joi.string().required(),
    });
    return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
