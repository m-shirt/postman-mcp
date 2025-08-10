/**
 * Function to view a promo code from the backend API.
 *
 * @param {Object} args - Arguments for the promo code retrieval.
 * @param {string} args.id - The ID of the promo code to retrieve.
 * @returns {Promise<Object>} - The result of the promo code retrieval.
 */
const executeFunction = async ({ id }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseURL}/api/admin/promos/${id}`;

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
    console.error('Error retrieving promo code:', error);
    return { error: 'An error occurred while retrieving the promo code.' };
  }
};

/**
 * Tool configuration for viewing a promo code from the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_promo_code',
      description: 'Retrieve a promo code from the backend API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the promo code to retrieve.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };