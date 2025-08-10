/**
 * Function to list orders from the backend API.
 *
 * @param {Object} args - Arguments for the order listing.
 * @param {string} [args.term=""] - Search term for filtering orders.
 * @param {string} [args.state_id=""] - State ID for filtering orders.
 * @param {string} [args.date_from=""] - Start date for filtering orders.
 * @param {string} [args.date_to=""] - End date for filtering orders.
 * @param {string} [args.start_date_time=""] - Start date and time for filtering orders.
 * @param {string} [args.end_date_time=""] - End date and time for filtering orders.
 * @param {Array} [args.branch_ids=[]] - List of branch IDs for filtering orders.
 * @param {string} [args.customer_name=""] - Customer name for filtering orders.
 * @param {string} [args.customer_email=""] - Customer email for filtering orders.
 * @param {string} [args.customer_phone=""] - Customer phone for filtering orders.
 * @param {number} [args.per_page=20] - Number of orders to return per page.
 * @param {number} [args.page=1] - Page number for pagination.
 * @returns {Promise<Array>} - The list of orders.
 */
const executeFunction = async ({
  term = "",
  state_id = "",
  date_from = "",
  date_to = "",
  start_date_time = "",
  end_date_time = "",
  branch_ids = [],
  customer_name = "",
  customer_email = "",
  customer_phone = "",
  per_page = 20,
  page = 1
}) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  const url = `${baseURL}/api/admin/v2/orders`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const body = {
    term,
    state_id,
    date_from,
    date_to,
    start_date_time,
    end_date_time,
    branch_ids,
    customer_name,
    customer_email,
    customer_phone,
    hide_scheduled: 1,
    per_page: per_page.toString(),
    page
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing orders:', error);
    return { error: 'An error occurred while listing orders.' };
  }
};

/**
 * Tool configuration for listing orders from the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_orders',
      description: 'List orders from the backend API.',
      parameters: {
        type: 'object',
        properties: {
          term: {
            type: 'string',
            description: 'Search term for filtering orders.'
          },
          state_id: {
            type: 'string',
            description: 'State ID for filtering orders.'
          },
          date_from: {
            type: 'string',
            description: 'Start date for filtering orders.'
          },
          date_to: {
            type: 'string',
            description: 'End date for filtering orders.'
          },
          start_date_time: {
            type: 'string',
            description: 'Start date and time for filtering orders.'
          },
          end_date_time: {
            type: 'string',
            description: 'End date and time for filtering orders.'
          },
          branch_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of branch IDs for filtering orders.'
          },
          customer_name: {
            type: 'string',
            description: 'Customer name for filtering orders.'
          },
          customer_email: {
            type: 'string',
            description: 'Customer email for filtering orders.'
          },
          customer_phone: {
            type: 'string',
            description: 'Customer phone for filtering orders.'
          },
          per_page: {
            type: 'integer',
            description: 'Number of orders to return per page.'
          },
          page: {
            type: 'integer',
            description: 'Page number for pagination.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };