const joi = require("joi");

const registerValidation = (data) => {
    const schema = joi.object().keys({
        firstname: joi
            .string()
            .pattern(/^[-'a-zA-ZÀ-ÿ\s]{1,50}$/)
            .required()
            .messages({
                "string.pattern.base": `Le Prénom ne correspond pas au modèle demandé (max 50 caractères pouvant contenir : des lettres majuscules, des lettres minuscules, des apostrophes ou 1 espace ou un tiret)`,
            }),
        lastname: joi
            .string()
            .pattern(/^[-'a-zA-ZÀ-ÿ\s]{1,50}$/)
            .required()
            .messages({
                "string.pattern.base": `Le Nom ne correspond pas au modèle demandé (max 50 caractères pouvant contenir : des lettres majuscules, des lettres minuscules, des apostrophes ou 1 espace ou un tiret)`,
            }),
        username: joi
            .string()
            .required()
            .pattern(/^[-_'0-9a-zA-ZÀ-ÿ]{1,20}$/)
            .messages({
                "string.pattern.base": `Le Pseudo ne correspond pas au modèle demandé (max 20 caractères pouvant contenir : 1 lettre majuscule, 1 lettre minuscule ou 1 chiffre ou 1 caractère spécial (-, _))`,
            }),
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

const updateValidation = (data) => {
    const schema = joi.object().keys({
        firstname: joi
            .string()
            .pattern(/^[-'a-zA-ZÀ-ÿ\s]{1,50}$/)
            .required()
            .messages({
                "string.pattern.base": `Le Prénom ne correspond pas au modèle demandé (max 50 caractères pouvant contenir : des lettres majuscules, des lettres minuscules, des apostrophes ou 1 espace ou un tiret)`,
            }),
        lastname: joi
            .string()
            .pattern(/^[-'a-zA-ZÀ-ÿ\s]{1,50}$/)
            .required()
            .messages({
                "string.pattern.base": `Le Nom ne correspond pas au modèle demandé (max 50 caractères pouvant contenir : des lettres majuscules, des lettres minuscules, des apostrophes ou 1 espace ou un tiret)`,
            }),
        email: joi.string().required().email(),
        phone: joi.any(),
        url_profile_img: joi.any(),
        check: joi.any()
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
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

module.exports = { registerValidation, loginValidation, updateValidation };
