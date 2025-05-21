export async function middleware(request: Request): Promise<Response> {
  const username = 'admin';
  const password = 'secret';
  const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

  const authHeader = request.headers.get('authorization');

  if (authHeader === basicAuth) {
    return fetch(request); // forward request to the app/site
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
      'Content-Type': 'text/plain',
    },
  });
}

// Optional: configure paths where middleware applies
export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'], // example: apply everywhere except some paths
};
