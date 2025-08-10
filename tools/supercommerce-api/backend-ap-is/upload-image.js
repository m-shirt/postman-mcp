/**
 * Function to upload an image to the server.
 *
 * @param {Object} args - Arguments for the image upload.
 * @param {string} args.file - The file path of the image to upload.
 * @param {number} args.dimensions - The dimensions for the image.
 * @returns {Promise<Object>} - The result of the image upload.
 */
const executeFunction = async ({ file, dimensions }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Set up the form data for the file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dimensions', dimensions);

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(`${baseURL}/api/admin/upload`, {
      method: 'POST',
      headers,
      body: formData
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
    console.error('Error uploading image:', error);
    return { error: 'An error occurred while uploading the image.' };
  }
};

/**
 * Tool configuration for uploading images to the server.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'upload_image',
      description: 'Upload an image to the server.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The file path of the image to upload.'
          },
          dimensions: {
            type: 'integer',
            description: 'The dimensions for the image.'
          }
        },
        required: ['file', 'dimensions']
      }
    }
  }
};

export { apiTool };