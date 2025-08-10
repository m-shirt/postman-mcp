/**
 * Function to activate a customer in the backend API.
 *
 * @param {Object} args - Arguments for activating the customer.
 * @param {string} args.id - The ID of the customer to activate.
 * @returns {Promise<Object>} - The result of the activation request.
 */
const executeFunction = async ({ id }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the activation request
    const url = `${baseURL}/api/admin/customers/${id}/activate`;

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
    console.error('Error activating customer:', error);
    return { error: 'An error occurred while activating the customer.' };
  }
};

/**
 * Tool configuration for activating a customer in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_customer',
      description: 'Activate a customer in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the customer to activate.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };