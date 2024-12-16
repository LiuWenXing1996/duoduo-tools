import { type JwtHeader, type JwtPayload, jwtDecode } from "jwt-decode";

export type DecodeJwtResult = {
  header: JwtHeader;
  payload: JwtPayload;
};

export const decodeJwt = (content: string): DecodeJwtResult => {
  const rawHeader = jwtDecode<JwtHeader>(content, { header: true });
  const rawPayload = jwtDecode<JwtPayload>(content);

  const header = rawHeader;
  const payload = rawPayload;

  return {
    header,
    payload,
  };
};

export const isValidJwt = (content: string) => {
  if (!content) {
    return false;
  }
  try {
    return Boolean(decodeJwt(content));
  } catch (error) {
    return false;
  }
};
