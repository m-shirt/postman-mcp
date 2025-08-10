/**
 * Function to create an option in the backend API.
 *
 * @param {Object} args - Arguments for creating an option.
 * @param {string} args.name_en - The English name of the option.
 * @param {string} args.name_ar - The Arabic name of the option.
 * @param {string} [args.description_en=""] - The English description of the option.
 * @param {string} [args.description_ar=""] - The Arabic description of the option.
 * @param {boolean} [args.appear_in_search=false] - Whether the option should appear in search results.
 * @param {number} [args.preview_type=1] - The preview type of the option.
 * @param {string} [args.type="1"] - The type of the option.
 * @param {number} [args.order=1] - The order of the option.
 * @param {Array<Object>} args.values - The values associated with the option.
 * @returns {Promise<Object>} - The result of the option creation.
 */
const executeFunction = async ({ name_en, name_ar, description_en = "", description_ar = "", appear_in_search = false, preview_type = 1, type = "1", order = 1, values }) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the API endpoint
    const url = `${baseURL}/api/admin/options`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Prepare the request body
    const body = JSON.stringify({
      name_en,
      name_ar,
      description_en,
      description_ar,
      appear_in_search,
      preview_type,
      type,
      order,
      values
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
    console.error('Error creating option:', error);
    return { error: 'An error occurred while creating the option.' };
  }
};

/**
 * Tool configuration for creating an option in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_option',
      description: 'Create an option in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          name_en: {
            type: 'string',
            description: 'The English name of the option.'
          },
          name_ar: {
            type: 'string',
            description: 'The Arabic name of the option.'
          },
          description_en: {
            type: 'string',
            description: 'The English description of the option.'
          },
          description_ar: {
            type: 'string',
            description: 'The Arabic description of the option.'
          },
          appear_in_search: {
            type: 'boolean',
            description: 'Whether the option should appear in search results.'
          },
          preview_type: {
            type: 'integer',
            description: 'The preview type of the option.'
          },
          type: {
            type: 'string',
            description: 'The type of the option.'
          },
          order: {
            type: 'integer',
            description: 'The order of the option.'
          },
          values: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name_en: { type: 'string' },
                name_ar: { type: 'string' },
                color_code: { type: 'string' },
                order: { type: 'string' },
                image: { type: 'string' }
              },
              required: ['name_en', 'name_ar', 'order']
            },
            description: 'The values associated with the option.'
          }
        },
        required: ['name_en', 'name_ar', 'values']
      }
    }
  }
};

export { apiTool };