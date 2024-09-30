export default interface IAccessToken {
  token_type: 'Bearer';
  access_token: string;
  expires_in: number;
}
