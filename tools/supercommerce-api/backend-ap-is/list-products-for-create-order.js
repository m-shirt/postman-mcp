/**
 * Function to list products for creating an order.
 *
 * @param {Object} args - Arguments for the product listing.
 * @param {string} args.keyword - The search keyword for products.
 * @param {string} args.user_id - The user ID for the request.
 * @param {string} args.address_id - The address ID for the request.
 * @returns {Promise<Array>} - The list of products for creating an order.
 */
const executeFunction = async ({ keyword, user_id, address_id }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseURL}/api/admin/v2/dropdown/products`);
    url.searchParams.append('q', keyword);
    url.searchParams.append('variant', '1');
    url.searchParams.append('user_id', user_id);
    url.searchParams.append('address_id', address_id);
    url.searchParams.append('page', '1');

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
    console.error('Error listing products for order creation:', error);
    return { error: 'An error occurred while listing products.' };
  }
};

/**
 * Tool configuration for listing products for creating an order.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_products_for_create_order',
      description: 'List products for creating an order.',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'The search keyword for products.'
          },
          user_id: {
            type: 'string',
            description: 'The user ID for the request.'
          },
          address_id: {
            type: 'string',
            description: 'The address ID for the request.'
          }
        },
        required: ['keyword', 'user_id', 'address_id']
      }
    }
  }
};

export { apiTool };