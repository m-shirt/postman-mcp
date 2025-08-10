/**
 * Function to create an order in the backend API.
 *
 * @param {Object} args - The order details.
 * @param {number} args.user_id - The ID of the user placing the order.
 * @param {number} args.address_id - The ID of the address for delivery.
 * @param {string} args.branch_id - The ID of the branch (optional).
 * @param {string} args.payment_method - The payment method ID.
 * @param {Array<Object>} args.items - The items in the order.
 * @param {string} args.notes - Any additional notes for the order.
 * @param {string} args.admin_notes - Notes for the admin.
 * @param {number} args.overwrite_fees - Fees to overwrite (if any).
 * @param {string} args.delivery_fees - Delivery fees (if any).
 * @param {number} args.has_address - Flag indicating if an address is provided.
 * @param {number} args.has_customer - Flag indicating if a customer is provided.
 * @param {boolean} args.notify_customer - Flag to notify the customer.
 * @returns {Promise<Object>} - The response from the API after creating the order.
 */
const executeFunction = async ({ user_id, address_id, branch_id = '', payment_method, items, notes = '', admin_notes = '', overwrite_fees = 0, delivery_fees = '', has_address = 0, has_customer = 1, notify_customer = true }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  const orderData = {
    user_id,
    address_id,
    branch_id,
    payment_method,
    items,
    notes,
    admin_notes,
    overwrite_fees,
    delivery_fees,
    has_address,
    has_customer,
    notify_customer
  };

  try {
    const response = await fetch(`${baseURL}/api/admin/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return { error: 'An error occurred while creating the order.' };
  }
};

/**
 * Tool configuration for creating an order in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_order',
      description: 'Create an order in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          user_id: {
            type: 'integer',
            description: 'The ID of the user placing the order.'
          },
          address_id: {
            type: 'integer',
            description: 'The ID of the address for delivery.'
          },
          branch_id: {
            type: 'string',
            description: 'The ID of the branch (optional).'
          },
          payment_method: {
            type: 'string',
            description: 'The payment method ID.'
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'The ID of the product.'
                },
                amount: {
                  type: 'integer',
                  description: 'The quantity of the product.'
                },
                product_name: {
                  type: 'string',
                  description: 'The name of the product.'
                },
                sku: {
                  type: 'string',
                  description: 'The SKU of the product.'
                },
                disabled: {
                  type: 'boolean',
                  description: 'Flag indicating if the product is disabled.'
                }
              },
              required: ['id', 'amount', 'product_name', 'sku', 'disabled']
            },
            description: 'The items in the order.'
          },
          notes: {
            type: 'string',
            description: 'Any additional notes for the order.'
          },
          admin_notes: {
            type: 'string',
            description: 'Notes for the admin.'
          },
          overwrite_fees: {
            type: 'integer',
            description: 'Fees to overwrite (if any).'
          },
          delivery_fees: {
            type: 'string',
            description: 'Delivery fees (if any).'
          },
          has_address: {
            type: 'integer',
            description: 'Flag indicating if an address is provided.'
          },
          has_customer: {
            type: 'integer',
            description: 'Flag indicating if a customer is provided.'
          },
          notify_customer: {
            type: 'boolean',
            description: 'Flag to notify the customer.'
          }
        },
        required: ['user_id', 'address_id', 'payment_method', 'items']
      }
    }
  }
};

export { apiTool };