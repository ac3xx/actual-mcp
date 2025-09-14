import { describe, it, expect, afterEach } from 'vitest';
import { formatAmount } from '../utils.js';

const originalCurrency = process.env.ACTUAL_CURRENCY;
const originalLocale = process.env.ACTUAL_LOCALE;

afterEach(() => {
  process.env.ACTUAL_CURRENCY = originalCurrency;
  process.env.ACTUAL_LOCALE = originalLocale;
});

describe('formatAmount', () => {
  it('uses USD formatting by default', () => {
    delete process.env.ACTUAL_CURRENCY;
    delete process.env.ACTUAL_LOCALE;
    expect(formatAmount(12345)).toBe('$123.45');
  });

  it('respects ACTUAL_CURRENCY and ACTUAL_LOCALE', () => {
    process.env.ACTUAL_CURRENCY = 'EUR';
    process.env.ACTUAL_LOCALE = 'de-DE';
    expect(formatAmount(12345)).toBe('123,45\u00A0€');
  });
});
