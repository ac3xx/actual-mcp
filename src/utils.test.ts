import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { formatAmount } from './utils';

const originalLocale = process.env.ACTUAL_LOCALE;
const originalCurrency = process.env.ACTUAL_CURRENCY;

describe('formatAmount', () => {
  beforeEach(() => {
    delete process.env.ACTUAL_LOCALE;
    delete process.env.ACTUAL_CURRENCY;
  });

  afterAll(() => {
    process.env.ACTUAL_LOCALE = originalLocale;
    process.env.ACTUAL_CURRENCY = originalCurrency;
  });

  it('formats amounts using USD by default', () => {
    expect(formatAmount(12345)).toBe('$123.45');
  });

  it('uses configured locale and currency', () => {
    process.env.ACTUAL_LOCALE = 'de-DE';
    process.env.ACTUAL_CURRENCY = 'EUR';
    expect(formatAmount(12345)).toBe('123,45\u00A0€');
  });
});
