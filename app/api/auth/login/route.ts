import { backendUrl, fetchJson, getClientIp } from '@/app/lib/utils';
import IAccessToken from '@/interfaces/IAccessToken';
import { cookies } from 'next/headers';
import moment from 'moment';
import { serializeError } from 'serialize-error';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const response = await fetchJson<IAccessToken>(backendUrl(`/login`), {
      method: 'POST',
      body: await request.text(),
      headers: {
        'Content-Type': 'application/json',
        'x-user-ip': getClientIp(request),
        'x-user-agent': request.headers.get('user-agent')!,
      },
    });

    // delete callback cookie
    cookies().delete(process.env.USER_AUTH_CALLBACK_URL_COOKIE_KEY!);

    // save the user token in the cookie
    cookies().set(process.env.USER_SESSION_COOKIE_KEY!, response.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      expires: moment(response.expires_in).toDate(),
    });

    return new Response(undefined, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify(serializeError(error)), { status: 500 });
  }
}
