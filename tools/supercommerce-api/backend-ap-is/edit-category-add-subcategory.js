/**
 * Function to edit a category or add a subcategory.
 *
 * @param {Object} args - Arguments for the category edit.
 * @param {number} args.id - The ID of the category to edit.
 * @param {string} args.image - The image URL for the category.
 * @param {string} args.slug - The slug for the category.
 * @param {string} args.name - The name of the category.
 * @param {string} args.name_ar - The Arabic name of the category.
 * @param {string} [args.description] - The description of the category.
 * @param {string} [args.description_ar] - The Arabic description of the category.
 * @param {number} args.order - The order of the category.
 * @param {number} args.featured - Indicates if the category is featured.
 * @param {Array<Object>} args.sub_categories - The subcategories to add.
 * @returns {Promise<Object>} - The result of the category edit operation.
 */
const executeFunction = async ({ id, image, slug, name, name_ar, description = null, description_ar = null, order, featured, sub_categories }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    const url = `${baseURL}/api/admin/categories/${id}`;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const body = JSON.stringify({
      id,
      image,
      slug,
      name,
      name_ar,
      description,
      description_ar,
      order,
      featured,
      sub_categories,
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
    console.error('Error editing category or adding subcategory:', error);
    return { error: 'An error occurred while editing the category or adding the subcategory.' };
  }
};

/**
 * Tool configuration for editing a category or adding a subcategory.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_category_add_subcategory',
      description: 'Edit a category or add a subcategory.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'The ID of the category to edit.'
          },
          image: {
            type: 'string',
            description: 'The image URL for the category.'
          },
          slug: {
            type: 'string',
            description: 'The slug for the category.'
          },
          name: {
            type: 'string',
            description: 'The name of the category.'
          },
          name_ar: {
            type: 'string',
            description: 'The Arabic name of the category.'
          },
          description: {
            type: 'string',
            description: 'The description of the category.'
          },
          description_ar: {
            type: 'string',
            description: 'The Arabic description of the category.'
          },
          order: {
            type: 'integer',
            description: 'The order of the category.'
          },
          featured: {
            type: 'integer',
            description: 'Indicates if the category is featured.'
          },
          sub_categories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'The ID of the subcategory.'
                },
                name: {
                  type: 'string',
                  description: 'The name of the subcategory.'
                },
                name_ar: {
                  type: 'string',
                  description: 'The Arabic name of the subcategory.'
                },
                image: {
                  type: 'string',
                  description: 'The image URL for the subcategory.'
                },
                slug: {
                  type: 'string',
                  description: 'The slug for the subcategory.'
                },
                order: {
                  type: 'integer',
                  description: 'The order of the subcategory.'
                },
                active: {
                  type: 'boolean',
                  description: 'Indicates if the subcategory is active.'
                }
              }
            },
            description: 'The subcategories to add.'
          }
        },
        required: ['id', 'image', 'slug', 'name', 'name_ar', 'order', 'featured', 'sub_categories']
      }
    }
  }
};

export { apiTool };