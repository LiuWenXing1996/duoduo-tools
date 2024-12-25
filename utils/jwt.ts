import { type JwtHeader, type JwtPayload, jwtDecode } from "jwt-decode";
import sign from "jwt-encode";
import { type Algorithm } from "jsonwebtoken";
// import * as jsonwebtoken from "jsonwebtoken";
import {
  SignJWT,
  exportPKCS8,
  exportSPKI,
  generateKeyPair,
  importJWK,
  importPKCS8,
} from "jose";

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

export enum JwtAlgorithm {
  "HS256" = "HS256",
  "HS384" = "HS384",
  "HS512" = "HS512",
  "RS256" = "RS256",
  "RS384" = "RS384",
  "RS512" = "RS512",
  "ES256" = "ES256",
  "ES384" = "ES384",
  "ES512" = "ES512",
  "PS256" = "PS256",
  "PS384" = "PS384",
  "PS512" = "PS512",
}

export const NeedRsaKeyJwtAlgorithmList: JwtAlgorithm[] = [
  JwtAlgorithm.RS256,
  JwtAlgorithm.RS384,
  JwtAlgorithm.RS512,
  JwtAlgorithm.ES256,
  JwtAlgorithm.ES384,
  JwtAlgorithm.ES512,
  JwtAlgorithm.PS256,
  JwtAlgorithm.PS384,
  JwtAlgorithm.PS512,
];

export const jwtGenerateKeyPair = async (alg: JwtAlgorithm) => {
  const { publicKey, privateKey } = await generateKeyPair(alg, {
    extractable: true,
  });

  const privateKeyStr = await exportPKCS8(privateKey);
  const publicKeyStr = await exportSPKI(publicKey);

  return {
    publicKey: publicKeyStr,
    privateKey: privateKeyStr,
  };
};

export type JwtEncodeOptions = {
  header: {
    alg: JwtAlgorithm;
    typ: "JWT";
  };
  payload: {
    iss?: string;
    exp?: number;
    sub?: string;
    aud?: string | string[];
    nbf?: number;
    iat?: number;
    jti?: string;
  };
  secret: string;
  custom?: {
    header?: {
      key: string;
      value: string;
    }[];
    payload?: {
      key: string;
      value: string;
    }[];
  };
};

export const jwtEncode = async (options: JwtEncodeOptions) => {
  const { header, payload, secret, custom } = options;

  const customPayloadArray = custom?.payload || [];
  const customPayload: Record<string, any> = {};
  customPayloadArray.map(({ key, value }) => {
    customPayload[key] = value;
  });
  const finalPayload = {
    ...payload,
    ...customPayload,
  };

  const customHeaderArray = custom?.header || [];
  const customHeader: Record<string, any> = {};
  customHeaderArray.map(({ key, value }) => {
    customHeader[key] = value;
  });
  const finalHeader = {
    ...header,
    ...customHeader,
  };
  let secretEncode: any = "";
  if (NeedRsaKeyJwtAlgorithmList.includes(header.alg)) {
    secretEncode = await importPKCS8(secret, header.alg);
  } else {
    secretEncode = new TextEncoder().encode(secret);
  }
  const signJWT = new SignJWT({
    ...finalPayload,
  });
  signJWT.setProtectedHeader({ ...finalHeader });
  const res = await signJWT.sign(secretEncode);
  return res;
};
