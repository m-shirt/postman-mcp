/**
 * Function to create an address for a customer.
 *
 * @param {Object} args - The address details.
 * @param {string} args.id - The ID of the customer.
 * @param {string} args.name - The name associated with the address.
 * @param {string} args.address - The address details.
 * @param {number} args.city_id - The ID of the city.
 * @param {number} args.area_id - The ID of the area.
 * @param {string} [args.landmark] - The landmark for the address.
 * @param {string} [args.building] - The building name.
 * @param {string} [args.phone] - The phone number.
 * @param {string} [args.floor] - The floor number.
 * @param {string} [args.apartment] - The apartment number.
 * @param {string} [args.shop_name] - The name of the shop.
 * @param {string} [args.commercial_record] - The commercial record details.
 * @param {string} [args.bank_account] - The bank account details.
 * @param {string} [args.contact_number] - The contact number.
 * @param {string} [args.shop_image] - The image of the shop.
 * @param {string} [args.attachment_2] - Additional attachment.
 * @param {string} [args.attachment_3] - Additional attachment.
 * @param {string} [args.email] - The email address.
 * @param {number} [args.lat=0] - The latitude of the address.
 * @param {number} [args.lng=0] - The longitude of the address.
 * @returns {Promise<Object>} - The response from the API after creating the address.
 */
const executeFunction = async ({ id, name, address, city_id, area_id, landmark = '', building = '', phone = '', floor = '', apartment = '', shop_name = '', commercial_record = '', bank_account = '', contact_number = '', shop_image = '', attachment_2 = '', attachment_3 = '', email = '', lat = 0, lng = 0 }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  const url = `${baseURL}/api/admin/customers/${id}/address`;

  const body = {
    name,
    address,
    city_id,
    area_id,
    landmark,
    building,
    phone,
    floor,
    apartment,
    shop_name,
    commercial_record,
    bank_account,
    contact_number,
    shop_image,
    attachment_2,
    attachment_3,
    email,
    lat,
    lng
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating address:', error);
    return { error: 'An error occurred while creating the address.' };
  }
};

/**
 * Tool configuration for creating an address for a customer.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_address',
      description: 'Create an address for a customer.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the customer.'
          },
          name: {
            type: 'string',
            description: 'The name associated with the address.'
          },
          address: {
            type: 'string',
            description: 'The address details.'
          },
          city_id: {
            type: 'integer',
            description: 'The ID of the city.'
          },
          area_id: {
            type: 'integer',
            description: 'The ID of the area.'
          },
          landmark: {
            type: 'string',
            description: 'The landmark for the address.'
          },
          building: {
            type: 'string',
            description: 'The building name.'
          },
          phone: {
            type: 'string',
            description: 'The phone number.'
          },
          floor: {
            type: 'string',
            description: 'The floor number.'
          },
          apartment: {
            type: 'string',
            description: 'The apartment number.'
          },
          shop_name: {
            type: 'string',
            description: 'The name of the shop.'
          },
          commercial_record: {
            type: 'string',
            description: 'The commercial record details.'
          },
          bank_account: {
            type: 'string',
            description: 'The bank account details.'
          },
          contact_number: {
            type: 'string',
            description: 'The contact number.'
          },
          shop_image: {
            type: 'string',
            description: 'The image of the shop.'
          },
          attachment_2: {
            type: 'string',
            description: 'Additional attachment.'
          },
          attachment_3: {
            type: 'string',
            description: 'Additional attachment.'
          },
          email: {
            type: 'string',
            description: 'The email address.'
          },
          lat: {
            type: 'number',
            description: 'The latitude of the address.'
          },
          lng: {
            type: 'number',
            description: 'The longitude of the address.'
          }
        },
        required: ['id', 'name', 'address', 'city_id', 'area_id']
      }
    }
  }
};

export { apiTool };