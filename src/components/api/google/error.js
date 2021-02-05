export class GoogleAPIBadKeyError extends Error {
  constructor(key) {
    super(`Authentication error: Google says this API key is bad: ${key}`);
    this.name = 'GoogleAPIBadKeyError';
  }
}
