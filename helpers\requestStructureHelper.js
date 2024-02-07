// helpers/requestStructureHelper.js

/**
 * Validates the structure and parameters of Walmart Affiliate API requests.
 * @param {Object} queryParams - The query parameters of the request.
 * @throws {Error} If the request structure is invalid.
 */
exports.validateAPIRequestStructure = (queryParams) => {
    const validParams = ['ids', 'upc', 'gtin', 'zipCode', 'storeId', 'sellerId'];
    const hasValidParams = validParams.some(param => queryParams[param]);

    if (!hasValidParams) {
        throw new Error('Invalid request structure: must include at least one of the following parameters - ' + validParams.join(', '));
    }

    // Validate 'ids' format (comma-separated, max 20 items)
    if (queryParams.ids && queryParams.ids.split(',').length > 20) {
        throw new Error("Invalid 'ids' parameter: exceeds maximum of 20 items.");
    }

    // Additional parameter validations can be added here, such as checking the format of 'zipCode' or 'storeId'
};