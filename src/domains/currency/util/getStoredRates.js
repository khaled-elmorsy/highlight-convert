import { StorageItem } from '@util/chrome/storage';

export const key = 'converters.currency.storedFetchedRates';
const storage = new StorageItem(key, chrome.storage.local);

/**
 * Return conversion rates from chrome's storage or an api request.
 * @returns {Promise<Rates>}
 */
export default async function getStoredRates() {
  /** @type {StorageItem<RateCache>} */
  const cache = await storage.get();

  const today = new Date().toLocaleDateString('en-us');

  if (cache && cache.date === today) {
    return cache.rates;
  }

  // Source: https://github.com/fawazahmed0/currency-api
  const request =
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
  const fallbackRequest =
    'https://latest.currency-api.pages.dev/v1/currencies/usd.json';

  const rates = await fetch(request)
    .then((res) => (res.ok ? res : fetch(fallbackRequest)))
    .then((res) => {
      if (!res.ok) throw 0;
      return res;
    })
    .then((res) => res.json())
    .then(({ usd }) => ({ ...usd, usd: 1 }))
    .catch(() => null);

  // If unable to communicate to the servers, use the last saved rate
  if (!rates) return cache.rates;

  await storage.set({ date: today, rates });
  return rates;
}
