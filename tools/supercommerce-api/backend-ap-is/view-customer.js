/**
 * Function to view a customer by ID.
 *
 * @param {Object} args - Arguments for the customer view.
 * @param {string} args.id - The ID of the customer to view.
 * @returns {Promise<Object>} - The result of the customer view.
 */
const executeFunction = async ({ id }) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseURL}/api/admin/customers/${id}`;

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
    console.error('Error viewing customer:', error);
    return { error: 'An error occurred while viewing the customer.' };
  }
};

/**
 * Tool configuration for viewing a customer.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_customer',
      description: 'View a customer by ID.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the customer to view.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };