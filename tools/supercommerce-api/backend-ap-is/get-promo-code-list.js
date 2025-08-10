/**
 * Function to get the promo code list from the backend API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {number} [args.page=1] - The page number for pagination.
 * @param {string} [args.q=''] - The search query for filtering promo codes.
 * @param {string} [args.mode='promocode'] - The mode for fetching promo codes.
 * @returns {Promise<Array>} - The list of promo codes.
 */
const executeFunction = async ({ page = 1, q = '', mode = 'promocode' }) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseURL}/api/admin/promos`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('q', q);
    url.searchParams.append('mode', mode);

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
    console.error('Error fetching promo code list:', error);
    return { error: 'An error occurred while fetching the promo code list.' };
  }
};

/**
 * Tool configuration for getting the promo code list from the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_promo_code_list',
      description: 'Fetch the list of promo codes from the backend API.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'The page number for pagination.'
          },
          q: {
            type: 'string',
            description: 'The search query for filtering promo codes.'
          },
          mode: {
            type: 'string',
            description: 'The mode for fetching promo codes.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };