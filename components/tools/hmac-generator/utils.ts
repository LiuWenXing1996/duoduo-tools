import {
  HmacMD5,
  HmacRIPEMD160,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA3,
  HmacSHA384,
  HmacSHA512,
} from "crypto-js";

export const methods: {
  name: string;
  example: string;
  run: (val: string, key: string) => string;
}[] = [
  { name: "MD5", example: "", run: (val, key) => HmacMD5(val, key).toString() },
  {
    name: "RipeMD-160",
    example: "",
    run: (val, key) => HmacRIPEMD160(val, key).toString(),
  },
  {
    name: "SHA-1",
    example: "",
    run: (val, key) => HmacSHA1(val, key).toString(),
  },
  {
    name: "SHA-224",
    example: "",
    run: (val, key) => HmacSHA224(val, key).toString(),
  },
  {
    name: "SHA-256",
    example: "",
    run: (val, key) => HmacSHA256(val, key).toString(),
  },
  {
    name: "SHA-3",
    example: "",
    run: (val, key) => HmacSHA3(val, key).toString(),
  },
  {
    name: "SHA-384",
    example: "",
    run: (val, key) => HmacSHA384(val, key).toString(),
  },
  {
    name: "SHA-512",
    example: "",
    run: (val, key) => HmacSHA512(val, key).toString(),
  },
];
