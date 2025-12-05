import { NextResponse } from "next/server";

/**
 * Sets CORS headers for Chrome extension compatibility
 * @param response - The NextResponse to add headers to
 * @returns The response with CORS headers added
 */
export function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

/**
 * Creates a CORS-enabled NextResponse
 * @param body - Response body
 * @param init - Response init options
 * @returns NextResponse with CORS headers
 */
export function createCorsResponse(body?: any, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(body, init);
  return setCorsHeaders(response);
}