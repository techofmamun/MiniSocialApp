const Joi = require('joi');

const schemas = {
  signup: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
    username: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/).required().messages({
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must be less than 30 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
      'any.required': 'Username is required',
    }),
    displayName: Joi.string().max(100).required().messages({
      'string.max': 'Display name must be less than 100 characters',
      'any.required': 'Display name is required',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),

  createPost: Joi.object({
    text: Joi.string().max(280).required().messages({
      'string.max': 'Post text must be 280 characters or less',
      'any.required': 'Post text is required',
    }),
  }),

  createComment: Joi.object({
    text: Joi.string().max(500).required().messages({
      'string.max': 'Comment text must be 500 characters or less',
      'any.required': 'Comment text is required',
    }),
  }),

  deviceToken: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Device token is required',
    }),
    deviceType: Joi.string().valid('ios', 'android', 'web').messages({
      'any.only': 'Device type must be ios, android, or web',
    }),
  }),
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return next(new Error(`Validation schema '${schemaName}' not found`));
    }

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

module.exports = { validate, schemas };
