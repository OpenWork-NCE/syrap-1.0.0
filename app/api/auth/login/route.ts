import {
  backendUrl,
  fetchJson,
  getClientIp,
  requestJsonBody,
} from '@/app/lib/utils';
import IAccessToken from '@/interfaces/IAccessToken';
import { cookies } from 'next/headers';
import moment from 'moment';
import { serializeError } from 'serialize-error';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Votre adresse e-mail est nécessaire' })
    .email('Une addresse corriel valide est requise'),
  password: z.string({ required_error: 'Le mot de passe est requis' }),
});

export async function POST(request: Request) {
  try {
    const bodyPayload = loginSchema.parse(await requestJsonBody(request));
    const response = await fetchJson<IAccessToken>(
      backendUrl(`/api/auth/login`),
      {
        method: 'POST',
        body: JSON.stringify(bodyPayload),
        headers: {
          'Content-Type': 'application/json',
          'x-user-ip': getClientIp(request),
          'x-user-agent': request.headers.get('user-agent')!,
        },
      },
    );

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
