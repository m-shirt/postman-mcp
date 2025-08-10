/**
 * Function to deactivate a customer.
 *
 * @param {Object} args - Arguments for the deactivation.
 * @param {string} args.id - The ID of the customer to deactivate.
 * @param {string} [args.deactivation_notes=""] - Notes regarding the deactivation.
 * @returns {Promise<Object>} - The result of the deactivation request.
 */
const executeFunction = async ({ id, deactivation_notes = "" }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseURL}/api/admin/customers/${id}/deactivate`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Prepare the request body
    const body = JSON.stringify({ deactivation_notes });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error deactivating customer:', error);
    return { error: 'An error occurred while deactivating the customer.' };
  }
};

/**
 * Tool configuration for deactivating a customer.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_customer',
      description: 'Deactivate a customer by ID.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the customer to deactivate.'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Notes regarding the deactivation.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };