// helpers/requestStructureHelper.js

/**
 * Validates the structure and parameters of Walmart Affiliate API requests based on detailed API documentation.
 * @param {Object} queryParams - The query parameters of the request.
 * @throws {Error} If the request structure is invalid.
 */
exports.validateAPIRequestStructure = (queryParams) => {
    const validParams = ['ids', 'upc', 'gtin', 'zipCode', 'storeId', 'sellerId'];
    const hasValidParams = validParams.some(param => queryParams.hasOwnProperty(param));

    if (!hasValidParams) {
        throw new Error('Invalid request structure: must include at least one of the specified parameters - ' + validParams.join(', '));
    }

    // Validate 'ids' format (comma-separated, max 20 items)
    if (queryParams.ids && queryParams.ids.split(',').length > 20) {
        throw new Error("Invalid 'ids' parameter: exceeds maximum of 20 items.");
    }

    // Validate 'zipCode' format (5 digits)
    if (queryParams.zipCode && !/^\d{5}$/.test(queryParams.zipCode)) {
        throw new Error("Invalid 'zipCode' parameter: must be a 5-digit code.");
    }

    // Validate 'storeId' format (numeric)
    if (queryParams.storeId && !/^\d+$/.test(queryParams.storeId)) {
        throw new Error("Invalid 'storeId' parameter: must be numeric.");
    }

    // Validate 'upc' format (12 digits)
    if (queryParams.upc && !/^\d{12}$/.test(queryParams.upc)) {
        throw new Error("Invalid 'upc' parameter: must be a 12-digit code.");
    }

    // Validate 'gtin' format (14 digits)
    if (queryParams.gtin && !/^\d{14}$/.test(queryParams.gtin)) {
        throw new Error("Invalid 'gtin' parameter: must be a 14-digit code.");
    }

    // 'sellerId' does not have a specified format in the docs but ensuring it's provided
    if (queryParams.sellerId && queryParams.sellerId.trim() === '') {
        throw new Error("Invalid 'sellerId' parameter: cannot be empty.");
    }

    // Additional validations for 'campaignId', 'adId', 'publisherId' could be implemented here if using those parameters.
};