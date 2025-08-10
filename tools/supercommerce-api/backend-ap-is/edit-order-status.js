/**
 * Function to edit the status of an order.
 *
 * @param {Object} args - Arguments for editing the order status.
 * @param {string} args.status_notes - Notes regarding the status.
 * @param {string} args.cancellation_text - Text for cancellation.
 * @param {string} args.cancellation_id - ID for cancellation.
 * @param {Array<number>} args.order_ids - List of order IDs to update.
 * @param {number} args.state_id - The new state ID for the orders.
 * @param {boolean} args.notify_customer - Whether to notify the customer.
 * @returns {Promise<Object>} - The result of the order status edit.
 */
const executeFunction = async ({ status_notes, cancellation_text, cancellation_id, order_ids, state_id, notify_customer }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    const url = `${baseURL}/api/admin/orders/bulk_change_state`;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const body = JSON.stringify({
      status_notes,
      cancellation_text,
      cancellation_id,
      order_ids,
      state_id,
      notify_customer
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
    console.error('Error editing order status:', error);
    return { error: 'An error occurred while editing the order status.' };
  }
};

/**
 * Tool configuration for editing order status.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_order_status',
      description: 'Edit the status of an order.',
      parameters: {
        type: 'object',
        properties: {
          status_notes: {
            type: 'string',
            description: 'Notes regarding the status.'
          },
          cancellation_text: {
            type: 'string',
            description: 'Text for cancellation.'
          },
          cancellation_id: {
            type: 'string',
            description: 'ID for cancellation.'
          },
          order_ids: {
            type: 'array',
            items: {
              type: 'integer'
            },
            description: 'List of order IDs to update.'
          },
          state_id: {
            type: 'integer',
            description: 'The new state ID for the orders.'
          },
          notify_customer: {
            type: 'boolean',
            description: 'Whether to notify the customer.'
          }
        },
        required: ['order_ids', 'state_id']
      }
    }
  }
};

export { apiTool };