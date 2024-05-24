interface RequestOptions extends RequestInit {
  bearerToken?: string;
}

export const createFetchWithBearerToken = (bearerToken?: string) => {
  return async (url: string, options: RequestOptions = {}) => {
    const { bearerToken: optionsBearerToken, ...requestOptions } = options;
    const headers = new Headers(requestOptions.headers);


    const token = optionsBearerToken || bearerToken;
    if (token) {
      headers.set('API-Key', token);
    }

    return fetch(url, {
      ...requestOptions,
      headers,
    });
  };
};