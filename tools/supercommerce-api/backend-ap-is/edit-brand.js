/**
 * Function to edit a brand in the backend API.
 *
 * @param {Object} args - Arguments for editing the brand.
 * @param {number} args.id - The ID of the brand to edit.
 * @param {string} args.name - The name of the brand.
 * @param {string} args.name_ar - The Arabic name of the brand.
 * @param {string} args.slug - The slug for the brand.
 * @param {number} args.featured - Indicates if the brand is featured (1 for true, 0 for false).
 * @param {string} args.image - The URL of the brand's image.
 * @param {Array} args.images - An array of additional images for the brand.
 * @returns {Promise<Object>} - The result of the brand edit operation.
 */
const executeFunction = async ({ id, name, name_ar, slug, featured, image, images }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseURL}/api/admin/brands/${id}`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Prepare the request body
    const body = JSON.stringify({
      id,
      name,
      name_ar,
      slug,
      featured,
      image,
      images
    });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'PATCH',
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
    console.error('Error editing brand:', error);
    return { error: 'An error occurred while editing the brand.' };
  }
};

/**
 * Tool configuration for editing a brand in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_brand',
      description: 'Edit a brand in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'The ID of the brand to edit.'
          },
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
          featured: {
            type: 'integer',
            description: 'Indicates if the brand is featured (1 for true, 0 for false).'
          },
          image: {
            type: 'string',
            description: 'The URL of the brand\'s image.'
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of additional images for the brand.'
          }
        },
        required: ['id', 'name', 'slug']
      }
    }
  }
};

export { apiTool };