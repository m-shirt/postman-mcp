/**
 * Function to create a brand.
 *
 * @param {Object} brandData - The data for the brand to be created.
 * @param {string} brandData.name - The name of the brand.
 * @param {string} brandData.name_ar - The Arabic name of the brand.
 * @param {string} brandData.slug - The slug for the brand.
 * @param {string} brandData.image - The URL of the brand image.
 * @param {boolean} brandData.featured - Indicates if the brand is featured.
 * @param {Array} brandData.images - An array of additional image URLs for the brand.
 * @returns {Promise<Object>} - The result of the brand creation.
 */
const executeFunction = async (brandData) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Set up the URL for the request
    const url = `${baseURL}/api/admin/brands`;

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
      body: JSON.stringify(brandData)
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
    console.error('Error creating brand:', error);
    return { error: 'An error occurred while creating the brand.' };
  }
};

/**
 * Tool configuration for creating a brand.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_brand',
      description: 'Create a new brand.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the brand.'
          },
          name_ar: {
            type: 'string',
            description: 'The Arabic name of the brand.'
          },
          slug: {
            type: 'string',
            description: 'The slug for the brand.'
          },
          image: {
            type: 'string',
            description: 'The URL of the brand image.'
          },
          featured: {
            type: 'boolean',
            description: 'Indicates if the brand is featured.'
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of additional image URLs for the brand.'
          }
        },
        required: ['name', 'slug', 'image']
      }
    }
  }
};

export { apiTool };