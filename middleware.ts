// Require HTTP Basic Auth when visiting https://app.fikadigital.org to view
// the survey editor. Exclude API endpoints.

export default async function middleware(request: Request): Promise<Response> {
  const username = 'admin';
  const password = process.env.AUTH_PASSWORD || 'defaultpassword';
  const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

  const authHeader = request.headers.get('authorization');

  if (authHeader === basicAuth) {
    return await fetch(request);
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
      'Content-Type': 'text/plain',
    },
  });
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
