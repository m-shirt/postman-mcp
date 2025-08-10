/**
 * Function to list customer groups for product pricing.
 *
 * @returns {Promise<Array>} - The list of customer groups.
 */
const executeFunction = async () => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the API request
    const url = `${baseURL}/api/admin/customer_groups/for-product-pricing`;

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
    console.error('Error listing customer groups:', error);
    return { error: 'An error occurred while listing customer groups.' };
  }
};

/**
 * Tool configuration for listing customer groups.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_customer_groups',
      description: 'List customer groups for product pricing.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };