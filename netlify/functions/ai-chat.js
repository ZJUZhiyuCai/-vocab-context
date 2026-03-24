import { forwardAIChatCompletion } from '../../server/aiProxy.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        Allow: 'POST',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: {
          message: 'Method not allowed.'
        }
      })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    return await forwardAIChatCompletion({
      body,
      env: process.env
    });
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: {
          message: error?.message || 'Unexpected server error.'
        }
      })
    };
  }
}
