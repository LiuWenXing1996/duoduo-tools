export const exampleUrl =
  "https://me:pwd@wbe.site:3000/url-parser?key1=value&key2=value2#the-hash";

export const methods: Record<
  string,
  {
    label: string;
    to: (url: URL) => string;
  }
> = {
  hash: {
    label: "hash",
    to: (url) => {
      return url.hash;
    },
  },
  host: {
    label: "host",
    to: (url) => {
      return url.host;
    },
  },
  hostname: {
    label: "hostname",
    to: (url) => {
      return url.hostname;
    },
  },
  origin: {
    label: "origin",
    to: (url) => {
      return url.origin;
    },
  },
  password: {
    label: "password",
    to: (url) => {
      return url.password;
    },
  },
  pathname: {
    label: "pathname",
    to: (url) => {
      return url.pathname;
    },
  },
  port: {
    label: "port",
    to: (url) => {
      return url.port;
    },
  },
  protocol: {
    label: "protocol",
    to: (url) => {
      return url.protocol;
    },
  },
  search: {
    label: "params",
    to: (url) => {
      return url.search;
    },
  },
  username: {
    label: "username",
    to: (url) => {
      return url.username;
    },
  },
};

export const parseUrlParams = (url: URL) => {
  return Object.entries(
    Object.fromEntries(url?.searchParams.entries() ?? [])
  ).map(([key, value]) => {
    return { key, value };
  });
};
