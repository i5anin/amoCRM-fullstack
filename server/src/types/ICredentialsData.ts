export default interface ICredentialsData {
    /**
     * Тип токена **("Bearer")**
     */
    token_type: string;

    /**
     * Через сколько истекает токен, _в секундах_ **(86400)**
     */
    expires_in: number;

    /**
     * Token в формате JWT **("xxxxxx")**
     */
    access_token: string;

    /**
     * Refresh Token **("xxxxxx")**
     */
    refresh_token: string;
}
