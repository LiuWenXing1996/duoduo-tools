import { pki } from "node-forge";
// @ts-ignore
import workerScript from "node-forge/dist/prime.worker.min?url";

export const rasGenerateRawPairs = (bits: number) => {
  return new Promise<pki.rsa.KeyPair>((resolve, reject) =>
    pki.rsa.generateKeyPair({ bits, workerScript }, (err, keyPair) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(keyPair);
    })
  );
};

export enum RsaType {
  "PKCS#1" = "PKCS#1",
  "PKCS#8" = "PKCS#8",
}

export const RsaTypeTransferMap: Record<
  RsaType,
  {
    privateKeyTo: (key: pki.rsa.PrivateKey) => string;
    privateKeyFrom: (val: string) => pki.rsa.PrivateKey;
    publicKeyTo: (key: pki.rsa.PublicKey) => string;
    publicKeyFrom: (val: string) => pki.rsa.PublicKey;
  }
> = {
  [RsaType["PKCS#1"]]: {
    privateKeyTo: (key) => {
      return pki.privateKeyToPem(key);
    },
    privateKeyFrom: (val) => {
      return pki.privateKeyFromPem(val);
    },
    publicKeyTo: (key) => {
      return pki.publicKeyToPem(key);
    },
    publicKeyFrom: (val) => {
      return pki.publicKeyFromPem(val);
    },
  },
  [RsaType["PKCS#8"]]: {
    privateKeyTo: (key) => {
      const rsaPrivateKey = pki.privateKeyToAsn1(key);
      const privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);
      return pki.privateKeyInfoToPem(privateKeyInfo);
    },
    privateKeyFrom: (val) => {
      return pki.privateKeyFromPem(val);
    },
    publicKeyTo: (key) => {
      return pki.publicKeyToPem(key);
    },
    publicKeyFrom: (val) => {
      return pki.publicKeyFromPem(val);
    },
  },
};

export const rasGenerate = async (params: { bits: number; type: RsaType }) => {
  const { bits, type } = params;
  const { privateKey, publicKey } = await rasGenerateRawPairs(bits);
  let privateKeyStr: string | undefined = undefined;
  let publicKeyStr: string | undefined = undefined;
  const transfer = unSafeObjectWrapper(RsaTypeTransferMap)[type];
  if (transfer) {
    privateKeyStr = transfer.privateKeyTo(privateKey);
    publicKeyStr = transfer.publicKeyTo(publicKey);
  }
  return {
    privateKey: privateKeyStr,
    publicKey: publicKeyStr,
  };
};
