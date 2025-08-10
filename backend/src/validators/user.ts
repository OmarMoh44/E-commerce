import { UserInfo } from "@src/types/user";
import { GraphQLError } from "graphql";
import Joi, { ObjectSchema, ValidationError } from "joi";
import { phone } from "phone";

const validateSignUp = (user: UserInfo): any => {
    validateName(user.name);
    validateEmail(user.email);
    user.phone = validatePhoneNumber(user.phone);
    validatePassword(user.password);
    validateConfirmPassword(user.password, user.confirmPassword);
};

const validateEmail = (email: any) => {
    const schema: ObjectSchema = Joi.object({
        email: Joi.string().label('email')
            .email()
            .messages({
                "string.base": "{{#label}} must be a string",
                "string.empty": "{{#label}} cannot be empty",
                "string.email": "{{#label}} must be a valid email",
                "any.required": "{{#label}} is required",
            })
            .required(),
    });
    const error: ValidationError | undefined = schema.validate(
        { email },
        { abortEarly: false }
    ).error;
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
};

const validatePassword = (password: any) => {
    const schema: ObjectSchema = Joi.object({
        password: Joi.string().label('password')
            .min(6)
            .max(50)
            .messages({
                "string.base": "{{#label}} must be a string",
                "string.empty": "{{#label}} cannot be empty",
                "string.min": "{{#label}} must be at least 6 characters",
                "string.max": "{{#label}} must be at most 50 characters",
                "any.required": "{{#label}} is required",
            })
            .required(),
    });
    const error: ValidationError | undefined = schema.validate(
        { password },
        { abortEarly: false }
    ).error;
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
};

const validateConfirmPassword = (password: any, confirmPassword: any) => {
    const schema: ObjectSchema = Joi.object({
        password: Joi.string().label('password').required().messages({
            "string.base": "{{#label}} must be a string",
            "string.empty": "{{#label}} cannot be empty",
            "any.required": "{{#label}} is required",
        }),
        confirmPassword: Joi.string().label('confirm password').valid(Joi.ref("password")).required().messages({
            "any.only": "passwords don't match",
            "string.base": "{{#label}} must be a string",
            "string.empty": "{{#label}} cannot be empty",
            "any.required": "{{#label}} is required",
        }),
    });
    const error: ValidationError | undefined = schema.validate(
        { password, confirmPassword },
        { abortEarly: false }
    ).error;
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
};

const validateName = (name: any) => {
    const schema: ObjectSchema = Joi.object({
        name: Joi.string().label('name')
            .min(6)
            .max(50)
            .messages({
                "string.base": "{{#label}} must be a string",
                "string.empty": "{{#label}} cannot be empty",
                "string.min": "{{#label}} must be at least 6 characters",
                "string.max": "{{#label}} must be at most 50 characters",
                "any.required": "{{#label}} is required",
            })
            .required(),
    });
    const error: ValidationError | undefined = schema.validate(
        { name },
        { abortEarly: false }
    ).error;
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
};

const validatePhoneNumber = (phoneNumber: any) => {
    const schema: ObjectSchema = Joi.object({
        phoneNumber: Joi.string().label('phone number')
            .pattern(/^\+[0-9\-\s]+$/) // start with + and allow only numbers and - and white spaces
            .messages({
                "string.base": "{{#label}} must be a string",
                "string.empty": "{{#label}} cannot be empty",
                "string.pattern.base": "{{#label}} structure is not valid",
                "any.required": "{{#label}} is required",
            })
            .required(),
    });
    const error: ValidationError | undefined = schema.validate(
        { phoneNumber },
        {
            abortEarly: false,
        }
    ).error;
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
    return checkPhoneNumber(phoneNumber);
};


function checkPhoneNumber(phoneNumber: string) {
    const regx = /^\+[0-9\-\s]+$/;
    if (!regx.test(phoneNumber)) {
        throw new GraphQLError("Phone number structure is not valid", {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
    const { countryIso3 } = phone(phoneNumber);
    if (!countryIso3) {
        throw new GraphQLError("Phone number structure is not valid", {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
    const phoneValidate = phone(phoneNumber, { country: countryIso3 });
    if (!phoneValidate.isValid) {
        throw new GraphQLError("Phone number structure is not valid", {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
    return phoneValidate.phoneNumber;
}



export { validateEmail, validatePassword, validateSignUp, validateName, validatePhoneNumber }