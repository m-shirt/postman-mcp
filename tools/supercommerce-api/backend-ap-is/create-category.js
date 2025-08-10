/**
 * Function to create a category in the backend API.
 *
 * @param {Object} categoryData - The data for the category to be created.
 * @param {string} categoryData.name - The name of the category.
 * @param {string} categoryData.name_ar - The Arabic name of the category.
 * @param {string} categoryData.image - The URL of the category image.
 * @param {string} categoryData.slug - The slug for the category.
 * @param {string} [categoryData.description=""] - The description of the category.
 * @param {string} [categoryData.description_ar=""] - The Arabic description of the category.
 * @param {number} categoryData.order - The order of the category.
 * @param {number} categoryData.featured - Whether the category is featured.
 * @param {Array<Object>} categoryData.sub_categories - The subcategories of the category.
 * @returns {Promise<Object>} - The result of the category creation.
 */
const executeFunction = async (categoryData) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/categories`;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    return { error: 'An error occurred while creating the category.' };
  }
};

/**
 * Tool configuration for creating a category in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_category',
      description: 'Create a new category in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the category.'
          },
          name_ar: {
            type: 'string',
            description: 'The Arabic name of the category.'
          },
          image: {
            type: 'string',
            description: 'The URL of the category image.'
          },
          slug: {
            type: 'string',
            description: 'The slug for the category.'
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
            description: 'Whether the category is featured.'
          },
          sub_categories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                name_ar: { type: 'string' },
                image: { type: 'string' },
                order: { type: 'integer' },
                slug: { type: 'string' },
                options: { type: 'array' , items: { type: 'string' },},
                active: { type: 'boolean' },
                hasHTMLEditor: { type: 'boolean' },
                html_top_en: { type: 'string' },
                html_top_ar: { type: 'string' },
                html_bottom_en: { type: 'string' },
                html_bottom_ar: { type: 'string' },
                meta_tag_title_en: { type: 'string' },
                meta_tag_title_ar: { type: 'string' },
                meta_tag_description_en: { type: 'string' },
                meta_tag_description_ar: { type: 'string' },
                meta_tag_keywords_en: { type: 'string' },
                meta_tag_keywords_ar: { type: 'string' },
                alt: { type: 'string' },
                alt_ar: { type: 'string' }
              }
            },
            description: 'The subcategories of the category.'
          }
        },
        required: ['name', 'name_ar', 'image', 'slug', 'order', 'featured', 'sub_categories']
      }
    }
  }
};

export { apiTool };