export async function GET() {
  return Response.json({
    ok: false,
    message: 'Google login is not configured in this demo build. Add the Google OAuth credentials to enable it.',
  });
}

export async function POST() {
  return Response.json({
    ok: false,
    message: 'Google login is not configured in this demo build. Add the Google OAuth credentials to enable it.',
  });
}
