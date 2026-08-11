import { isString } from "radash";

const EncryptionTypes = ["WPA/WPA2", "WEP"] as const;
export type EncryptionType = (typeof EncryptionTypes)[number];

export type ConnectGeneratorOptions = {
  ssid: string;
  encryption?: {
    type: EncryptionType;
    password: string;
  };
  isHidden?: boolean;
};

export type Exports = {
  EncryptionType: EncryptionType;
  ConnectGeneratorOptions: ConnectGeneratorOptions;
};

export const isWifiConnectGeneratorEncryptionType = (
  val: string
): val is EncryptionType => {
  if (!isString(val)) {
    return false;
  }
  if (!EncryptionTypes.includes(val as any)) {
    return false;
  }
  return true;
};

export const wifiConnectGenerator = (options: ConnectGeneratorOptions) => {
  const escapeString = (str: string) => {
    return str.replace(/([\\;,:"])/g, "\\$1");
  };
  const { ssid, encryption, isHidden } = unSafeObjectDeepWrapper(options);
  if (!ssid) {
    throw new Error("undefined ssid");
  }

  let res = `WIFI:S:${escapeString(ssid)};`;
  if (encryption) {
    if (!encryption.type) {
      throw new Error(`undefined encryption.type`);
    }
    if (!isWifiConnectGeneratorEncryptionType(encryption.type)) {
      throw new Error(`unknown encryption.type: ${encryption.type}`);
    }
    if (!encryption.password) {
      throw new Error(`undefined encryption.password`);
    }
    res = `${res}T:${encryption.type};P:${escapeString(encryption.password)};`;
  }
  if (isHidden) {
    res = `${res};H:true;`;
  } else {
    res = `${res};;`;
  }
  return res;
};
