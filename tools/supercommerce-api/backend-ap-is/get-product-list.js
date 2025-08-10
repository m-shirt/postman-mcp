/**
 * Function to get the product list from the backend API.
 *
 * @param {Object} args - Arguments for the product list retrieval.
 * @param {string} args.page - The page number for pagination.
 * @param {string} args.keyword_or_sku - The keyword or SKU to search for products.
 * @param {string} [args.category_id] - The category ID to filter products.
 * @param {string} [args.sub_category_id] - The sub-category ID to filter products.
 * @param {string} [args.inventory_id] - The inventory ID to filter products.
 * @param {string} [args.parent_id] - The parent ID to filter products.
 * 
 * @returns {Promise<Object>} - The result of the product list retrieval.
 */
const executeFunction = async ({ page, keyword_or_sku, category_id, sub_category_id, inventory_id, parent_id  }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseURL}/api/admin/v2/products`);
    url.searchParams.append('page', page);
    url.searchParams.append('q', keyword_or_sku);
    if (category_id) url.searchParams.append('category_id', category_id);
    if (sub_category_id) url.searchParams.append('sub_category_id', sub_category_id);
    if (inventory_id) url.searchParams.append('inventory_id', inventory_id);
    if (parent_id) url.searchParams.append('parent_id', parent_id);

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
    console.error('url:', url.toString());

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving product list:', error);
    return { error: 'An error occurred while retrieving the product list.' };
  }
};

/**
 * Tool configuration for getting the product list from the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_product_list',
      description: 'Retrieve the product list from the backend API.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            description: 'The page number for pagination.'
          },
          keyword_or_sku: {
            type: 'string',
            description: 'The keyword or SKU to search for products.'
          },
          category_id: {
            type: 'string',
            description: 'The category ID to filter products.'
          },
          sub_category_id: {
            type: 'string',
            description: 'The sub-category ID to filter products.'
          },
          inventory_id: {
            type: 'string',
            description: 'The inventory ID to filter products.'
          },
          parent_id: {
            type: 'string',
            description: 'The parent ID to filter products.'
          }
        },
        required: ['page', 'keyword_or_sku']
      }
    }
  }
};

export { apiTool };