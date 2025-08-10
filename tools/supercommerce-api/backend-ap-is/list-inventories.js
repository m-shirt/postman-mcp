/**
 * Function to list inventories from the backend API.
 *
 * @returns {Promise<Array>} - The list of inventories.
 */
const executeFunction = async () => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseURL}/api/admin/inventories/all`;

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
    console.error('Error listing inventories:', error);
    return { error: 'An error occurred while listing inventories.' };
  }
};

/**
 * Tool configuration for listing inventories from the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_inventories',
      description: 'List all inventories from the backend API.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };