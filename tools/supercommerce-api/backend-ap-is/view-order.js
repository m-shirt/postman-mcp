/**
 * Function to view an order from the backend API.
 *
 * @param {Object} args - Arguments for the view order request.
 * @param {string} args.id - The ID of the order to view.
 * @returns {Promise<Object>} - The result of the order view request.
 */
const executeFunction = async ({ id }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the order
    const url = `${baseURL}/api/admin/orders/${id}`;

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
    console.error('Error viewing order:', error);
    return { error: 'An error occurred while viewing the order.' };
  }
};

/**
 * Tool configuration for viewing an order from the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_order',
      description: 'View an order from the backend API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the order to view.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };