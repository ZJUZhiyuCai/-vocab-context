export const DEFAULT_AI_MODEL = 'Qwen/Qwen2.5-72B-Instruct';
export const DEFAULT_AI_BASE_URL = 'https://api.siliconflow.cn/v1';

function sanitizeApiKey(apiKey) {
  return String(apiKey || '').trim().replace(/[^\x00-\x7F]/g, '');
}

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || DEFAULT_AI_BASE_URL).trim().replace(/\/$/, '');
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };
}

export async function forwardAIChatCompletion({
  body = {},
  env = process.env,
  fetchImpl = fetch
}) {
  const apiKey = sanitizeApiKey(body.apiKey) || sanitizeApiKey(env.SILICONFLOW_API_KEY);

  if (!apiKey) {
    return jsonResponse(500, {
      error: {
        message: 'SiliconFlow API key is not configured.'
      }
    });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonResponse(400, {
      error: {
        message: 'messages is required.'
      }
    });
  }

  const payload = {
    model: String(env.SILICONFLOW_MODEL || DEFAULT_AI_MODEL).trim(),
    messages: body.messages,
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
    max_tokens: typeof body.maxTokens === 'number'
      ? body.maxTokens
      : (typeof body.max_tokens === 'number' ? body.max_tokens : 800)
  };

  const topP = typeof body.topP === 'number'
    ? body.topP
    : (typeof body.top_p === 'number' ? body.top_p : undefined);

  if (typeof topP === 'number') {
    payload.top_p = topP;
  }

  try {
    const upstreamResponse = await fetchImpl(`${normalizeBaseUrl(env.SILICONFLOW_API_BASE_URL)}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseBody = await upstreamResponse.text();

    return {
      statusCode: upstreamResponse.status,
      headers: {
        'Content-Type': upstreamResponse.headers.get('content-type') || 'application/json'
      },
      body: responseBody
    };
  } catch (error) {
    return jsonResponse(502, {
      error: {
        message: error?.message || 'Failed to reach SiliconFlow.'
      }
    });
  }
}
