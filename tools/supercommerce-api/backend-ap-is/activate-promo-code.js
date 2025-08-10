/**
 * Function to activate a promo code.
 *
 * @param {Object} args - Arguments for activating the promo code.
 * @param {string} args.id - The ID of the promo code to activate.
 * @returns {Promise<Object>} - The result of the activation request.
 */
const executeFunction = async ({ id }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the activation request
    const url = `${baseURL}/api/admin/promos/${id}/activate`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
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
    console.error('Error activating promo code:', error);
    return { error: 'An error occurred while activating the promo code.' };
  }
};

/**
 * Tool configuration for activating a promo code.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_promo_code',
      description: 'Activate a promo code.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the promo code to activate.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };