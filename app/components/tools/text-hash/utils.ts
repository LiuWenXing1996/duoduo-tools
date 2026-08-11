import {
  MD5,
  RIPEMD160,
  SHA1,
  SHA224,
  SHA256,
  SHA3,
  SHA384,
  SHA512,
} from "crypto-js";

export const methods: {
  name: string;
  example: string;
  run: (val: string) => string;
}[] = [
  { name: "MD5", example: "", run: (val) => MD5(val).toString() },
  { name: "RipeMD-160", example: "", run: (val) => RIPEMD160(val).toString() },
  { name: "SHA-1", example: "", run: (val) => SHA1(val).toString() },
  { name: "SHA-224", example: "", run: (val) => SHA224(val).toString() },
  { name: "SHA-256", example: "", run: (val) => SHA256(val).toString() },
  { name: "SHA-3", example: "", run: (val) => SHA3(val).toString() },
  { name: "SHA-384", example: "", run: (val) => SHA384(val).toString() },
  { name: "SHA-512", example: "", run: (val) => SHA512(val).toString() },
];
