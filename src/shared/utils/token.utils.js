import qs from 'qs'

export const createTokenRequestData = ({
  grantType = 'password',
  clientId,
  clientSecret,
  username,
  password
}) => {
  return qs.stringify({
    grant_type: grantType,
    client_id: clientId,
    client_secret: clientSecret,
    username,
    password
  })
}

export const createRefreshTokenRequestData = ({
  clientId,
  clientSecret,
  refreshToken
}) => {
  return qs.stringify({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken
  })
}
