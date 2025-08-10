/**
 * Function to create a customer in the backend system.
 *
 * @param {Object} customerData - The data for the customer to be created.
 * @param {string} customerData.name - The first name of the customer.
 * @param {string} customerData.last_name - The last name of the customer.
 * @param {string} customerData.email - The email address of the customer.
 * @param {string|null} [customerData.group_id=null] - The group ID the customer belongs to.
 * @param {string} customerData.phone - The phone number of the customer.
 * @param {string} customerData.password - The password for the customer account.
 * @param {Array} customerData.closed_payment_methods - An array of closed payment methods.
 * @param {string} [customerData.postponed_payment_limit=""] - The postponed payment limit.
 * @returns {Promise<Object>} - The result of the customer creation.
 */
const executeFunction = async (customerData) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    const url = `${baseURL}/api/admin/customers`;

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
    console.error('Error creating customer:', error);
    return { error: 'An error occurred while creating the customer.' };
  }
};

/**
 * Tool configuration for creating a customer in the backend system.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_customer',
      description: 'Create a new customer in the backend system.',
      parameters: {
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
            description: 'The email address of the customer.'
          },
          group_id: {
            type: 'string',
            nullable: true,
            description: 'The group ID the customer belongs to.'
          },
          phone: {
            type: 'string',
            description: 'The phone number of the customer.'
          },
          password: {
            type: 'string',
            description: 'The password for the customer account.'
          },
          closed_payment_methods: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of closed payment methods.'
          },
          postponed_payment_limit: {
            type: 'string',
            description: 'The postponed payment limit.'
          }
        },
        required: ['name', 'last_name', 'email', 'phone', 'password']
      }
    }
  }
};

export { apiTool };