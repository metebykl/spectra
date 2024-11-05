const _decodeURI = (value: string) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? decodeURIComponent(value) : value;
};

export const mergePath = (...paths: string[]): string => {
  let p: string = "";
  let endsWithSlash = false;

  for (let path of paths) {
    /* ['/foo/','/bar'] => ['/foo', '/bar'] */
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }

    /* ['/foo','bar'] => ['/foo', '/bar'] */
    if (path[0] !== "/") {
      path = `/${path}`;
    }

    /* ['/user/', '/'] => `/user/` */
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }

    /* ['/', '/'] => `/` */
    if (path === "/" && p === "") {
      p = "/";
    }
  }

  return p;
};

export const getQueryParam = (
  url: string,
  key?: string,
  multiple?: boolean
):
  | string
  | undefined
  | string[]
  | Record<string, string>
  | Record<string, string[]> => {
  let encoded;

  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex = url.indexOf(`?${key}`);
    if (keyIndex === -1) {
      keyIndex = url.indexOf(`&${key}`);
    }
    while (keyIndex !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(
          url.slice(valueIndex, endIndex === -1 ? undefined : endIndex)
        );
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex = url.indexOf(`&${key}`, keyIndex + 1);
    }

    encoded = /[%+]/.test(url);
    if (!encoded) {
      return undefined;
    }
  }

  const results: Record<string, string> | Record<string, string[]> = {};
  encoded ??= /[%+]/.test(url);

  let keyIndex = url.indexOf("?");
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1
        ? nextKeyIndex === -1
          ? undefined
          : nextKeyIndex
        : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }

    keyIndex = nextKeyIndex;

    if (name === "") {
      continue;
    }

    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(
        valueIndex + 1,
        nextKeyIndex === -1 ? undefined : nextKeyIndex
      );
      if (encoded) {
        value = _decodeURI(value);
      }
    }

    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      (results[name] as string[]).push(value);
    } else {
      results[name] ??= value;
    }
  }

  return key ? results[key] : results;
};
