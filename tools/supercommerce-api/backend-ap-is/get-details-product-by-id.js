/**
 * Function to get product details by ID.
 *
 * @param {Object} args - Arguments for the product details request.
 * @param {string} args.id - The ID of the product to retrieve details for.
 * @returns {Promise<Object>} - The result of the product details request.
 */
const executeFunction = async ({ id }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the product details request
    const url = `${baseURL}/api/admin/products/${id}`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting product details:', error);
    return { error: 'An error occurred while getting product details.' };
  }
};

/**
 * Tool configuration for getting product details by ID.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_product_details',
      description: 'Get details of a product by its ID.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the product to retrieve details for.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };