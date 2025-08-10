/**
 * Function to update the main product in the backend API.
 *
 * @param {Object} args - Arguments for the product update.
 * @param {string} args.id - The ID of the product to update.
 * @param {number} args.brand_id - The ID of the brand.
 * @param {string} args.category_id - The ID of the category.
 * @param {string} args.name - The name of the product.
 * @param {string} args.name_ar - The Arabic name of the product.
 * @param {number} args.preorder - Indicates if the product is a preorder.
 * @param {boolean} args.available_soon - Indicates if the product will be available soon.
 * @param {boolean} productData.bundle_checkout - Indicates if the product is a bundle.
 * @param {Array<number>} args.product_variant_options - Array of variant option IDs.
 * @param {string} args.sku - The SKU of the product.
 * @param {string} args.type - The type of the product.
 * @returns {Promise<Object>} - The result of the product update.
 */
const executeFunction = async ({ id, brand_id, category_id, name, name_ar, preorder, available_soon, product_variant_options, sku, type }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    // Construct the URL for the product update
    const url = `${baseURL}/api/admin/products/${id}`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Create the request body
    const body = JSON.stringify({
      brand_id,
      category_id,
      name,
      name_ar,
      preorder,
      available_soon,
      product_variant_options,
      sku,
      type
    });

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
    console.error('Error updating the product:', error);
    return { error: 'An error occurred while updating the product.' };
  }
};

/**
 * Tool configuration for updating the main product in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_main_product',
      description: 'Update the main product in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the product to update.'
          },
          brand_id: {
            type: 'string',
            description: 'The ID of the brand.'
          },
          category_id: {
            type: 'string',
            description: 'The ID of the category.'
          },
          name: {
            type: 'string',
            description: 'The name of the product.'
          },
          name_ar: {
            type: 'string',
            description: 'The Arabic name of the product.'
          },
          preorder: {
            type: 'integer',
            description: 'Indicates if the product is a preorder.'
          },
          available_soon: {
            type: 'boolean',
            description: 'Indicates if the product will be available soon.'
          },
           bundle_checkout: {
            type: 'boolean',
            description: 'Indicates if the product is a bundle.'
          },
          product_variant_options: {
            type: 'array',
            items: {
              type: 'integer'
            },
            description: 'Array of variant option IDs.'
          },
          sku: {
            type: 'string',
            description: 'The SKU of the product.'
          },
          type: {
            type: 'string',
            description: 'The type of the product. "1" for regular, "2" for bundle.'
          }
        },
       required: ['id', 'brand_id', 'category_id', 'name', 'sku', 'type' , 'bundle_checkout' , 'available_soon'],

      }
    }
  }
};

export { apiTool };