/**
 * Idempotent fetch wrapper attaches client-generated X-Idempotency-Key
 * to POST / PUT / PATCH / DELETE requests to prevent duplicate server writes.
 */
export async function idempotentFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const method = (init?.method || 'GET').toUpperCase();
  const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  const headers = new Headers(init?.headers);
  if (isMutating && !headers.has('X-Idempotency-Key')) {
    headers.set('X-Idempotency-Key', crypto.randomUUID());
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
