/**
 * Function to edit a customer in the backend API.
 *
 * @param {Object} args - Arguments for editing the customer.
 * @param {string} args.id - The ID of the customer to edit.
 * @param {Object} args.customerData - The data to update for the customer.
 * @param {string} args.customerData.name - The first name of the customer.
 * @param {string} args.customerData.last_name - The last name of the customer.
 * @param {string} args.customerData.email - The email of the customer.
 * @param {string} [args.customerData.group_id] - The group ID of the customer.
 * @param {string} args.customerData.phone - The phone number of the customer.
 * @param {string} args.customerData.password - The password for the customer.
 * @param {Array} args.customerData.closed_payment_methods - The closed payment methods for the customer.
 * @param {number} [args.customerData.postponed_payment_limit] - The postponed payment limit for the customer.
 * @returns {Promise<Object>} - The result of the customer edit operation.
 */
const executeFunction = async ({ id, customerData }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseURL}/api/admin/customers/${id}`;

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
      body: JSON.stringify(customerData)
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
    console.error('Error editing customer:', error);
    return { error: 'An error occurred while editing the customer.' };
  }
};

/**
 * Tool configuration for editing a customer in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_customer',
      description: 'Edit a customer in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the customer to edit.'
          },
          customerData: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The first name of the customer.'
              },
              last_name: {
                type: 'string',
                description: 'The last name of the customer.'
              },
              email: {
                type: 'string',
                description: 'The email of the customer.'
              },
              group_id: {
                type: 'string',
                description: 'The group ID of the customer.'
              },
              phone: {
                type: 'string',
                description: 'The phone number of the customer.'
              },
              password: {
                type: 'string',
                description: 'The password for the customer.'
              },
              closed_payment_methods: {
                type: 'array',
                items: { type: 'string' },
                description: 'The closed payment methods for the customer.'
              },
              postponed_payment_limit: {
                type: 'number',
                description: 'The postponed payment limit for the customer.'
              }
            },
            required: ['name', 'last_name', 'email', 'phone', 'password', 'closed_payment_methods']
          }
        },
        required: ['id', 'customerData']
      }
    }
  }
};

export { apiTool };