/**
 * Function to create a main product in the backend API.
 *
 * @param {Object} productData - The data for the product to be created.
 * @param {number} productData.brand_id - The ID of the brand.
 * @param {string} productData.category_id - The ID of the category.
 * @param {string} productData.name - The name of the product.
 * @param {string} productData.name_ar - The Arabic name of the product.
 * @param {number} productData.preorder - Indicates if the product is a preorder.
 * @param {boolean} productData.available_soon - Indicates if the product will be available soon.
 * @param {boolean} productData.bundle_checkout - Indicates if the product is a bundle.
 * @param {Array<number>} productData.product_variant_options - An array of variant option IDs.
 * @param {string} productData.sku - The SKU of the product.
 * @param {string} productData.type - The type of the product.
 * @returns {Promise<Object>} - The result of the product creation.
 */
const executeFunction = async (productData) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the API endpoint
    const url = `${baseURL}/api/admin/products`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(productData)
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
    console.error('Error creating product:', error);
    return { error: 'An error occurred while creating the product.' };
  }
};

/**
 * Tool configuration for creating a main product in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_main_product',
      description: `1- When create a product must create main product first then create a variant (the sku for the main product is main_{{sku}}
2- if the product has multible variants (ex differant colors) must add product_variant_options in the main like color and select color ex red to when create the variant to make user select beteen variants`,
      parameters: {
        type: 'object',
        properties: {
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
            description: 'An array of variant option IDs.'
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
        required: ['brand_id', 'category_id', 'name', 'sku', 'type' , 'bundle_checkout' , 'available_soon'],
      }
    }
  }
};

export { apiTool };