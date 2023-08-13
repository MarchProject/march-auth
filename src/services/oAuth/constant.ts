import * as qs from 'querystring'

export const configOAtuh = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  revokeTokenUrl: 'https://oauth2.googleapis.com/revoke',
  redirectUrl: process.env.REDIRECT_URL,
}

export const authParams = qs.stringify({
  client_id: configOAtuh.clientId,
  redirect_uri: configOAtuh.redirectUrl,
  response_type: 'code',
  scope: 'openid profile email',
  access_type: 'offline',
  state: 'standard_oauth',
  prompt: 'consent',
})
