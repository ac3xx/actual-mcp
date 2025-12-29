import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { formatAmount, formatDate, getDateRange, getDateRangeForMonths } from './utils.js';

describe('formatAmount', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
    delete process.env.ACTUAL_CURRENCY;
    delete process.env.ACTUAL_LOCALE;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('default behavior (USD, en-US)', () => {
    it('should format positive amounts in USD by default', () => {
      const result = formatAmount(123456); // $1,234.56
      expect(result).toBe('$1,234.56');
    });

    it('should format negative amounts in USD by default', () => {
      const result = formatAmount(-123456); // -$1,234.56
      expect(result).toBe('-$1,234.56');
    });

    it('should format zero correctly', () => {
      const result = formatAmount(0);
      expect(result).toBe('$0.00');
    });
  });

  describe('custom currency and locale', () => {
    it('should format amounts in EUR with de-DE locale', () => {
      process.env.ACTUAL_CURRENCY = 'EUR';
      process.env.ACTUAL_LOCALE = 'de-DE';

      const result = formatAmount(123456); // €1.234,56
      // German locale uses . for thousands and , for decimals
      // Check key characteristics of de-DE EUR formatting
      expect(result).toContain('1.234,56');
      expect(result).toContain('€');
    });

    it('should format amounts in GBP with en-GB locale', () => {
      process.env.ACTUAL_CURRENCY = 'GBP';
      process.env.ACTUAL_LOCALE = 'en-GB';

      const result = formatAmount(123456); // £1,234.56
      expect(result).toBe('£1,234.56');
    });

    it('should format amounts in JPY with ja-JP locale', () => {
      process.env.ACTUAL_CURRENCY = 'JPY';
      process.env.ACTUAL_LOCALE = 'ja-JP';

      const result = formatAmount(123456); // ¥1,235 (JPY has no decimal places)
      // JPY rounds to whole numbers and uses the yen symbol
      expect(result).toContain('1,235');
      expect(result).toMatch(/[¥￥]/); // Match either yen symbol variant
    });

    it('should use custom currency with default locale', () => {
      process.env.ACTUAL_CURRENCY = 'EUR';
      // ACTUAL_LOCALE not set, should use en-US

      const result = formatAmount(123456);
      expect(result).toBe('€1,234.56');
    });

    it('should use custom locale with default currency', () => {
      process.env.ACTUAL_LOCALE = 'de-DE';
      // ACTUAL_CURRENCY not set, should use USD

      const result = formatAmount(123456);
      // Check key characteristics of de-DE USD formatting
      expect(result).toContain('1.234,56');
      expect(result).toContain('$');
    });
  });

  describe('edge cases', () => {
    it('should return "N/A" for null', () => {
      const result = formatAmount(null);
      expect(result).toBe('N/A');
    });

    it('should return "N/A" for undefined', () => {
      const result = formatAmount(undefined);
      expect(result).toBe('N/A');
    });

    it('should handle very large amounts', () => {
      const result = formatAmount(999999999999); // $9,999,999,999.99
      expect(result).toBe('$9,999,999,999.99');
    });

    it('should handle fractional cents correctly', () => {
      const result = formatAmount(12345); // $123.45
      expect(result).toBe('$123.45');
    });
  });
});

describe('formatDate', () => {
  it('should format Date object as YYYY-MM-DD', () => {
    const date = new Date('2024-03-15T10:30:00Z');
    const result = formatDate(date);
    expect(result).toBe('2024-03-15');
  });

  it('should return string date as-is', () => {
    const result = formatDate('2024-03-15');
    expect(result).toBe('2024-03-15');
  });

  it('should return empty string for null', () => {
    const result = formatDate(null);
    expect(result).toBe('');
  });

  it('should return empty string for undefined', () => {
    const result = formatDate(undefined);
    expect(result).toBe('');
  });
});

describe('getDateRange', () => {
  it('should return provided dates when both are given', () => {
    const result = getDateRange('2024-01-01', '2024-03-31');
    expect(result).toEqual({
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    });
  });

  it('should use default 3-month range when no dates provided', () => {
    const result = getDateRange();
    expect(result.startDate).toBeTruthy();
    expect(result.endDate).toBeTruthy();
    // startDate should be approximately 3 months before endDate
    const start = new Date(result.startDate);
    const end = new Date(result.endDate);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    expect(diffMonths).toBeGreaterThanOrEqual(2);
    expect(diffMonths).toBeLessThanOrEqual(3);
  });
});

describe('getDateRangeForMonths', () => {
  it('should calculate correct date range for 3 months', () => {
    const result = getDateRangeForMonths(3);
    expect(result.start).toMatch(/^\d{4}-\d{2}-01$/); // First day of a month
    expect(result.end).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Last day of current month
  });

  it('should calculate correct date range for 1 month', () => {
    const result = getDateRangeForMonths(1);
    const start = new Date(result.start);
    const end = new Date(result.end);

    // Should be same month
    expect(start.getMonth()).toBe(end.getMonth());
    expect(start.getFullYear()).toBe(end.getFullYear());
  });

  it('should handle 12 months correctly', () => {
    const result = getDateRangeForMonths(12);
    const start = new Date(result.start);
    const end = new Date(result.end);

    // Difference should be about 12 months
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    expect(diffMonths).toBe(11); // 12 months inclusive means 11 month difference
  });
});
