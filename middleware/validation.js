const { isCelebrate } = require('celebrate');

exports.validateRequestBody = (schema, options = {}) => {
  return async (req, res, next) => {
    try {
      // Validate the request body against the provided schema
      await schema.validateAsync(req.body, { abortEarly: false, ...options });

      // If validation succeeds, continue to the next middleware or route handler
      next();
    } catch (validationError) {
      if (isCelebrate(validationError)) {
        // If the validation error is from Celebrate middleware, extract the details
        const { joi } = validationError.details.get('body');
        const { message, context } = joi.details[0];

        // Log the validation error details
        console.error(`Request body validation failed: ${message}`);
        console.error('Validation context:', context);

        // Return a 400 Bad Request response with the validation error message
        return res.status(400).json({ message });
      } else {
        // If an unexpected error occurs during validation, log it
        console.error('Request body validation error:', validationError);

        // Check for custom error message
        const errorMessage = options.errorMessage || 'Invalid request body';

        // Return a 400 Bad Request response with the custom error message
        return res.status(400).json({ message: errorMessage });
      }
    }
  };
};