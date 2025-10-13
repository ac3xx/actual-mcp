import { describe, it, expect, afterEach } from 'vitest';
import { formatAmount } from '../utils.js';

const originalCurrency = process.env.ACTUAL_CURRENCY;
const originalLocale = process.env.ACTUAL_LOCALE;

afterEach(() => {
  if (originalCurrency !== undefined) {
    process.env.ACTUAL_CURRENCY = originalCurrency;
  } else {
    delete process.env.ACTUAL_CURRENCY;
  }

  if (originalLocale !== undefined) {
    process.env.ACTUAL_LOCALE = originalLocale;
  } else {
    delete process.env.ACTUAL_LOCALE;
  }
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

  it('falls back to default formatting with invalid locale/currency', () => {
    process.env.ACTUAL_CURRENCY = 'INVALID';
    process.env.ACTUAL_LOCALE = 'invalid-locale';
    // Should fall back to USD formatting
    expect(formatAmount(12345)).toBe('$123.45');
  });
});
