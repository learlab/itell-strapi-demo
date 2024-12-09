import "client-only";

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
export const setCookie = (
  name: string,
  value: any,
  maxAgeInSeconds: number = WEEK_IN_SECONDS
) => {
  const cookieString = [
    `${name}=${value.toString()}`,
    "path=/",
    `max-age=${maxAgeInSeconds}`,
    "SameSite=Lax",
    // Uncomment the next line if your site uses HTTPS
    // 'Secure'
  ].join("; ");

  document.cookie = cookieString;
};
