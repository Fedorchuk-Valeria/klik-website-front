export const getQueryString = (obj?: {
  [key: string]: string | number | null | undefined | boolean;
}): string => {
  if (!obj) return '';

  let query = '?';

  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      query += `${key}=${obj[key]}&`;
    }
  });

  return query.slice(0, -1);
};

export const getFromQueryString = (str: string): { [key: string]: string } => {
  if (!str && !str?.startsWith('?')) return {};

  return Object.fromEntries(
    str
      ?.slice(1)
      ?.split('&')
      ?.map((item) => item?.split('=')) as [string, string][],
  );
};

export const getValuesByStringArray = (
  search: string,
  key: string,
): string[] => {
  const params = new URLSearchParams(search);

  const values = [];
  const regex = new RegExp(`^${key}\\[(\\d+)\\]$`);

  for (const [key, value] of params) {
    const match = key.match(regex);

    if (match) {
      values.push(value);
    }
  }

  return values;
};

export default {
  getQueryString,
  getValuesByStringArray,
  getFromQueryString,
};
