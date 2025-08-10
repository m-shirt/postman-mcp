/**
 * Function to get all sub-categories by category ID.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.id - The ID of the category to retrieve sub-categories for.
 * @returns {Promise<Array>} - The list of sub-categories for the specified category.
 */
const executeFunction = async ({ id }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseURL}/api/admin/v2/dropdown/categories/${id}/subcategories`;

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
    console.error('Error getting sub-categories:', error);
    return { error: 'An error occurred while getting sub-categories.' };
  }
};

/**
 * Tool configuration for getting sub-categories by category ID.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_subcategories_by_category_id',
      description: 'Get all sub-categories by category ID.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the category to retrieve sub-categories for.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };