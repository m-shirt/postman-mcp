/**
 * Function to get the promo code list from the backend API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {number} [args.page=1] - The page number for pagination.
 * @param {string} [args.q=''] - The search query for filtering promo codes.
 * @param {string|Array|string[]} [args.mode='promocode'] - The mode for fetching promo codes.
 *                                                        Can be 'promocode', 'reward', 'all', or an array like ['promocode', 'reward'].
 * @returns {Promise<Array|Object>} - The list of promo codes or error object.
 */
const executeFunction = async ({ page = 1, q = '', mode = 'promocode' }) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  // Determine API mode parameter based on input
  let apiMode = mode;

  if (mode === 'all') {
    apiMode = null;
  } else if (Array.isArray(mode)) {
    const hasPromo = mode.includes('promocode');
    const hasReward = mode.includes('reward');
    if (hasPromo && hasReward) {
      apiMode = null;
    } else if (hasPromo) {
      apiMode = 'promocode';
    } else if (hasReward) {
      apiMode = 'reward';
    } else {
      // If array is empty or doesn't contain valid modes, default to 'promocode'
      apiMode = 'promocode';
    }
  }

  try {
    const url = new URL(`${baseURL}/api/admin/promos`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('q', q);
    if (apiMode !== null) {
      url.searchParams.append('mode', apiMode);
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

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
            type: ['string', 'array'],
            description: "The mode for fetching promo codes: 'promocode', 'reward', 'all', or ['promocode', 'reward']."
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };
