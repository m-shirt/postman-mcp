/**
 * Function to list customers from the backend API.
 *
 * @param {Object} args - Arguments for the customer search.
 * @param {Array} [args.ids=[]] - Array of customer IDs to filter the search.
 * @param {string} [args.name=""] - Name of the customer to search for.
 * @param {string} [args.email=""] - Email of the customer to search for.
 * @param {string} [args.phone=""] - Phone number of the customer to search for.
 * @param {string|null} [args.customer_type=null] - Type of customer to filter the search.
 * @param {Array} [args.area_id=[]] - Array of area IDs to filter the search.
 * @param {Array} [args.city_id=[]] - Array of city IDs to filter the search.
 * @param {boolean|null} [args.active=null] - Filter for active customers.
 * @param {string} [args.page="1"] - Page number for pagination.
 * @param {string} [args.admin_approved=""] - Filter for admin-approved customers.
 * @returns {Promise<Array>} - The list of customers matching the search criteria.
 */
const executeFunction = async ({
  ids = [],
  name = '',
  email = '',
  phone = '',
  customer_type = null,
  area_id = [],
  city_id = [],
  active = null,
  page = '1',
  admin_approved = ''
}) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  
  try {
    const url = `${baseURL}/api/admin/v2/customers/search`;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const body = JSON.stringify({
      ids,
      name,
      email,
      phone,
      customer_type,
      area_id,
      city_id,
      active,
      page,
      admin_approved
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing customers:', error);
    return { error: 'An error occurred while listing customers.' };
  }
};

/**
 * Tool configuration for listing customers from the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_customers',
      description: 'List customers from the backend API.',
      parameters: {
        type: 'object',
        properties: {
          ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of customer IDs to filter the search.'
          },
          name: {
            type: 'string',
            description: 'Name of the customer to search for.'
          },
          email: {
            type: 'string',
            description: 'Email of the customer to search for.'
          },
          phone: {
            type: 'string',
            description: 'Phone number of the customer to search for.'
          },
          customer_type: {
            type: 'string',
            nullable: true,
            description: 'Type of customer to filter the search.'
          },
          area_id: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of area IDs to filter the search.'
          },
          city_id: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of city IDs to filter the search.'
          },
          active: {
            type: 'boolean',
            nullable: true,
            description: 'Filter for active customers.'
          },
          page: {
            type: 'string',
            description: 'Page number for pagination.'
          },
          admin_approved: {
            type: 'string',
            description: 'Filter for admin-approved customers.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };