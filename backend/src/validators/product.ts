import { ProductInfo } from "@models/product";
import { GraphQLError } from "graphql";
import Joi, { ObjectSchema, ValidationError } from "joi";

const validateProductData = (product: ProductInfo): any => {
    validateTitle(product.title);
    validateDesc(product.description);
    validatePrice(product.price);
    validateDiscount(product.discount);
    validateStock(product.stock);
    validateCategoryName(product.categoryName);
    validateBrand(product.brand);
};

const validateTitle = (title: any) => {
    const schema: ObjectSchema = Joi.object({
        title: Joi.string().label('title')
            .min(10)
            .max(75)
            .messages({
                "string.base": "{{#label}} must be a string",
                "string.min": "{{#label}} must be at least 10 characters",
                "string.max": "{{#label}} must be at most 75 characters",
                "string.empty": "{{#label}} cannot be empty",
                "any.required": "{{#label}} is required",
            })
            .required(),
    });
    const error: ValidationError | undefined = schema.validate(
        { title },
        { abortEarly: false }
    ).error;
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
};

const validateDesc = (description: any) => {
    const schema: ObjectSchema = Joi.object({
        description: Joi.string().label('description')
            .min(100)
            .messages({
                "string.base": "{{#label}} must be a string",
                "string.min": "{{#label}} must be at least 100 characters",
                "string.empty": "{{#label}} cannot be empty",
                "any.required": "{{#label}} is required",
            })
            .required(),
    });
    const error: ValidationError | undefined = schema.validate(
        { description },
        { abortEarly: false }
    ).error;
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
};

const validatePrice = (price: any) => {
    const schema: ObjectSchema = Joi.object({
        price: Joi.number().label('price')
            .required()
            .messages({
                "number.base": "{{#label}} must be a number",
                "number.empty": "{{#label}} cannot be empty",
                "any.required": "{{#label}} is required",
            }),
    });
    const { error }: { error?: ValidationError } = schema.validate(
        { price },
        { abortEarly: false }
    );
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
};

const validateDiscount = (discount: any) => {
    const schema: ObjectSchema = Joi.object({
        discount: Joi.number().label('discount')
            .required()
            .messages({
                "number.base": "{{#label}} must be a number",
                "number.empty": "{{#label}} cannot be empty",
                "any.required": "{{#label}} is required",
            }),
    });
    const { error }: { error?: ValidationError } = schema.validate(
        { discount },
        { abortEarly: false }
    );
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
};

const validateStock = (stock: any) => {
    const schema: ObjectSchema = Joi.object({
        stock: Joi.number().label('stock')
            .required()
            .messages({
                "number.base": "{{#label}} must be a number",
                "number.empty": "{{#label}} cannot be empty",
                "any.required": "{{#label}} is required",
            }),
    });
    const { error }: { error?: ValidationError } = schema.validate(
        { stock },
        { abortEarly: false }
    );
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
};

const validateCategoryName = (categoryName: any) => {
    const schema: ObjectSchema = Joi.object({
        categoryName: Joi.string().label('category name')
            .required()
            .messages({
                "string.base": "{{#label}} must be a string",
                "string.empty": "{{#label}} cannot be empty",
                "any.required": "{{#label}} is required",
            }),
    });
    const { error }: { error?: ValidationError } = schema.validate(
        { categoryName },
        { abortEarly: false }
    );
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
};

const validateBrand = (brand: any) => {
    const schema: ObjectSchema = Joi.object({
        brand: Joi.string().label('brand')
            .required()
            .messages({
                "string.base": "{{#label}} must be a string",
                "string.empty": "{{#label}} cannot be empty",
                "any.required": "{{#label}} is required",
            }),
    });
    const { error }: { error?: ValidationError } = schema.validate(
        { brand },
        { abortEarly: false }
    );
    if (error) {
        throw new GraphQLError(error.details[0].message, {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
};

export { validateProductData };