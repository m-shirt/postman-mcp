/**
 * Function to get a paginated list of categories from the API.
 *
 * @param {Object} args - Arguments for the category list request.
 * @param {number} [args.page=1] - The page number to retrieve.
 * @param {string} [args.q=""] - The search query for filtering categories.
 * @returns {Promise<Array>} - The list of categories.
 */
const executeFunction = async ({ page = 1, q = "" }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseURL}/api/admin/v2/categories`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('q', q);

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
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
    console.error('Error getting category list:', error);
    return { error: 'An error occurred while retrieving the category list.' };
  }
};

/**
 * Tool configuration for getting a paginated list of categories.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_category_list',
      description: 'Get a paginated list of categories from the API.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'The page number to retrieve.'
          },
          q: {
            type: 'string',
            description: 'The search query for filtering categories.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };