export async function GET(request: Request) {
  return new Response(
    'get survey',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
export async function POST(request: Request) {
  return new Response(
    'post survey',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
export async function PUT(request: Request) {
  return new Response(
    'put survey',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
export async function DELETE(request: Request) {
  return new Response(
    'delete survey',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}