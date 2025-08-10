/**
 * Promo Code Types
 * 
 * 'Amount' => 1,
 * 'Percent' => 2,
 * 'Free Delivery' => 3,
 * 'Exclusive' => 4,
 */
const PROMO_TYPES = {
  Amount: 1,
  Percent: 2,
  FreeDelivery: 3,
  Exclusive: 4
};

/**
 * Work With Promotion options
 * 
 * 'yes' => 1,            // work with
 * 'cant' => 2,           // doesn't work, raise error
 * 'removePromotion' => 3,// remove promotion, override discount
 * 'originalPrice' => 4   // remove promotion, override discount
 */
const WORK_WITH_PROMOTION = {
  yes: 1,
  cant: 2,
  removePromotion: 3,
  originalPrice: 4
};

/**
 * Function to edit an existing promo code.
 *
 * @param {Object} args - The details of the promo code to edit.
 * @param {string} args.id - The ID of the promo code to edit.
 * @param {string} args.name - The name of the promo code.
 * @param {string} args.description - A description of the promo code.
 * @param {number} args.type - The type of promo code (1 for Amount, 2 for Percent, etc.).
 * @param {number} args.amount - The amount for the promo code.
 * @param {string|null} args.max_amount - The maximum amount for the promo code.
 * @param {string} args.expiration_date - The expiration date of the promo code.
 * @param {string} args.start_date - The start date of the promo code.
 * @param {string|null} args.random_count - Random count.
 * @param {string|null} args.minimum_amount - Minimum amount.
 * @param {number|null} args.uses_per_user - Uses per user.
 * @param {string|null} args.usage_limit - Usage limit.
 * @param {string|null} args.customer_phones - Customer phones.
 * @param {string|null} args.target_type - Target type.
 * @param {number} args.work_with_promotion - Indicates if the promo works with promotions.
 * @param {number} args.first_order - Indicates if this is for first orders.
 * @param {number} args.free_delivery - Indicates if the promo includes free delivery.
 * @param {number} args.show_in_product - Show in product flag.
 * @param {number} args.check_all_conditions - Check all conditions flag.
 * @param {Array} args.conditions - Conditions array.
 * @param {string|null} args.vendor_id - Vendor ID.
 * @param {number} args.mobile_only - Mobile only flag.
 * @param {string|null} args.payment_methods - Payment methods.
 * @param {Array|null} args.customer_ids - Customer IDs.
 * @returns {Promise<Object>} - The result of the promo code update.
 */
const executeFunction = async ({
  id,
  name,
  description,
  type,
  amount,
  max_amount,
  expiration_date,
  start_date,
  random_count,
  minimum_amount,
  uses_per_user,
  usage_limit,
  customer_phones,
  target_type,
  work_with_promotion,
  first_order,
  free_delivery,
  show_in_product,
  check_all_conditions,
  conditions,
  vendor_id,
  mobile_only,
  payment_methods,
  customer_ids
}) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL with promo ID
    const url = `${baseURL}/api/admin/promos/${id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const bodyObj = {
      name,
      description,
      type,
      amount,
      max_amount,
      expiration_date,
      start_date,
      random_count,
      minimum_amount,
      uses_per_user,
      usage_limit,
      customer_phones,
      target_type,
      work_with_promotion,
      first_order,
      free_delivery,
      show_in_product,
      check_all_conditions,
      conditions,
      vendor_id,
      mobile_only,
      payment_methods,
      customer_ids
    };

    const body = JSON.stringify(bodyObj);
    console.error('body:', body);

    // PUT request to update promo
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating the promo code:', error);
    return { error: 'An error occurred while updating the promo code.' };
  }
};

/**
 * Tool configuration for editing a promo code.
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_promo_code',
      description: `Edit an existing promo code by ID.

Types:
1 => Amount
2 => Percent
3 => Free Delivery
4 => Exclusive

WORK_WITH_PROMOTION:
1 => yes (work with)
2 => cant (doesn't work, raise error)
3 => removePromotion (remove promotion, override discount)
4 => originalPrice (remove promotion, override discount)

Flags are 0 or 1 for:
first_order, free_delivery, show_in_product, check_all_conditions

Must send all keys as in the request body.`,
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The ID of the promo code to edit.' },
          name: { type: 'string', description: 'The name of the promo code.' },
          description: { type: 'string', description: 'A description of the promo code.' },
          type: {
            type: 'integer',
            enum: Object.values(PROMO_TYPES),
            description: 'Promo code type (1-Amount, 2-Percent, 3-Free Delivery, 4-Exclusive).'
          },
          amount: { type: 'number', description: 'The amount for the promo code.' },
          max_amount: { type: ['string', 'null'], description: 'Maximum amount for the promo code.' },
          expiration_date: { type: 'string', description: 'Expiration date of the promo code.' },
          start_date: { type: 'string', description: 'Start date of the promo code.' },
          random_count: { type: ['string', 'null'], description: 'Random count.' },
          minimum_amount: { type: ['string', 'null'], description: 'Minimum amount.' },
          uses_per_user: { type: ['integer', 'null'], description: 'Uses per user.' },
          usage_limit: { type: ['string', 'null'], description: 'Usage limit.' },
          customer_phones: { type: ['string', 'null'], description: 'Customer phones.' },
          target_type: { type: ['string', 'null'], description: 'Target type.' },
          work_with_promotion: {
            type: 'integer',
            enum: Object.values(WORK_WITH_PROMOTION),
            description: 'Work with promotion flag.'
          },
          first_order: { type: 'integer', enum: [0, 1], description: 'First order flag.' },
          free_delivery: { type: 'integer', enum: [0, 1], description: 'Free delivery flag.' },
          show_in_product: { type: 'integer', enum: [0, 1], description: 'Show in product flag.' },
          check_all_conditions: { type: 'integer', enum: [0, 1], description: 'Check all conditions flag.' },
          conditions: { type: 'array', description: 'Conditions array.', items: { type: 'object' } },
          vendor_id: { type: ['string', 'null'], description: 'Vendor ID.' },
          mobile_only: { type: 'integer', enum: [0, 1], description: 'Mobile only flag.' },
          payment_methods: { type: ['string', 'null'], description: 'Payment methods.' },
          customer_ids: { type: ['array', 'null'], description: 'Customer IDs.', items: { type: 'string' } }
        },
        required: [
          'id',
          'name',
          'description',
          'type',
          'amount',
          'max_amount',
          'expiration_date',
          'start_date',
          'random_count',
          'minimum_amount',
          'uses_per_user',
          'usage_limit',
          'customer_phones',
          'target_type',
          'work_with_promotion',
          'first_order',
          'free_delivery',
          'show_in_product',
          'check_all_conditions',
          'vendor_id',
          'mobile_only',
          'payment_methods',
          'customer_ids'
        ]
      }
    }
  }
};

export { apiTool, PROMO_TYPES, WORK_WITH_PROMOTION };
