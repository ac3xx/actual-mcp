import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatAmount } from './utils.js';

describe('formatAmount', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should format amount in USD by default', () => {
    expect(formatAmount(1000)).toBe('$10.00');
    expect(formatAmount(1234)).toBe('$12.34');
    expect(formatAmount(0)).toBe('$0.00');
  });

  it('should return N/A for undefined or null', () => {
    expect(formatAmount(undefined)).toBe('N/A');
    expect(formatAmount(null)).toBe('N/A');
  });

  it('should respect ACTUAL_CURRENCY and ACTUAL_LOCALE environment variables', () => {
    process.env.ACTUAL_CURRENCY = 'EUR';
    process.env.ACTUAL_LOCALE = 'de-DE';
    
    // 1000 cents = 10.00 EUR -> 10,00 € in de-DE
    // Note: The exact output might depend on the node version's ICU data, 
    // but typically it is "10,00 €" or "10,00 €" (with nbsp).
    // Let's check for "10,00" and "€" to be safe or normalize spaces.
    const result = formatAmount(1000);
    expect(result).toContain('10,00');
    expect(result).toContain('€');
  });

  it('should use ACTUAL_CURRENCY with default locale', () => {
    process.env.ACTUAL_CURRENCY = 'GBP';
    // Default locale is en-US
    
    expect(formatAmount(1000)).toBe('£10.00');
  });
});
