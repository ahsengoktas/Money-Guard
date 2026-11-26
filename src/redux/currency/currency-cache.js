export const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_KEY = 'money-guard:currency:v1';
const CURRENCIES = [
  { code: 'USD', numericCode: 840 },
  { code: 'EUR', numericCode: 978 },
];
const UAH_CODE = 980;

const isRate = (value) => Number.isFinite(value) && value > 0;

export const normalizeRates = (data) => {
  if (!Array.isArray(data)) throw new Error('Invalid currency response.');

  return CURRENCIES.map(({ code, numericCode }) => {
    const rate = data.find(
      (item) =>
        item?.currencyCodeA === numericCode && item.currencyCodeB === UAH_CODE,
    );
    if (!isRate(rate?.rateBuy) || !isRate(rate?.rateSell)) {
      throw new Error(`Exchange rate for ${code} is unavailable.`);
    }
    return { code, buy: rate.rateBuy, sell: rate.rateSell };
  });
};

const isValidCache = (cache) =>
  Number.isFinite(cache?.updatedAt) &&
  cache.updatedAt > 0 &&
  cache.updatedAt <= Date.now() &&
  Array.isArray(cache.rates) &&
  cache.rates.length === CURRENCIES.length &&
  CURRENCIES.every(({ code }, index) => {
    const rate = cache.rates[index];
    return rate?.code === code && isRate(rate.buy) && isRate(rate.sell);
  });

export const isFresh = (updatedAt, now = Date.now()) =>
  Number.isFinite(updatedAt) &&
  updatedAt > 0 &&
  now >= updatedAt &&
  now - updatedAt < CACHE_TTL_MS;

export const readCurrencyCache = () => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
    return isValidCache(cache) ? cache : null;
  } catch {
    return null;
  }
};

export const writeCurrencyCache = (cache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage may be blocked or full; rates remain available in Redux.
  }
};
