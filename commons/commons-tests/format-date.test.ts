import { describe, it, expect, beforeEach } from 'vitest';
import { FormatDate } from '../index.js';

describe('GIVEN the FormatDate class', () => {
  let formatDate: FormatDate;

  beforeEach(() => {
    formatDate = new FormatDate();
  });

  describe('WHEN the withFormat method is called', () => {
    it('THEN it returns the correct formatted date with default values', () => {
      const testDate = new Date('2021-01-01T12:30:45.123Z');
      const formattedDate: string = formatDate.withFormat('yyyy-MM-ddThh:mm:ss.fff', testDate, 'UTC');
      expect(formattedDate).toBe('2021-01-01T12:30:45.123');
    });

    it('THEN it returns the correct formatted date with custom values', () => {
      const date = new Date('2021-01-01T00:00:00.000Z');
      const formattedDate: string = formatDate.withFormat('MM/dd/yyyy', date);

      expect(formattedDate).toBe('01/01/2021');
    });

    const formats: Array<{ format: string; expected: (date: Date) => string }> = [
      { format: 'MM/dd/yyyy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', timeZone: 'UTC' }) },
      { format: 'MM/dd/yy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', timeZone: 'UTC' }) },
      { format: 'MM/dd', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', timeZone: 'UTC' }) },
      { format: 'MM/yy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', year: '2-digit', timeZone: 'UTC' }) },
      { format: 'MM/yyyy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric', timeZone: 'UTC' }) },
      { format: 'MM-dd-yyyy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', timeZone: 'UTC' })
        .replace(/\//g, '-') },
      { format: 'MM-dd-yy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', timeZone: 'UTC' })
        .replace(/\//g, '-') },
      { format: 'MM-dd', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', timeZone: 'UTC' })
        .replace(/\//g, '-') },
      { format: 'MM-yy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', year: '2-digit', timeZone: 'UTC' })
        .replace(/\//g, '-') },
      { format: 'MM-yyyy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric', timeZone: 'UTC' })
        .replace(/\//g, '-') },
      { format: 'MMddyyyy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', timeZone: 'UTC' })
        .replace(/\//g, '') },
      { format: 'MMddyy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', timeZone: 'UTC' })
        .replace(/\//g, '') },
      { format: 'MMdd', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', timeZone: 'UTC' }).
        replace(/\//g, '') },
      { format: 'MMyy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', year: '2-digit', timeZone: 'UTC' })
        .replace(/\//g, '') },
      { format: 'MMyyyy', expected: (date: Date) => date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric', timeZone: 'UTC' })
        .replace(/\//g, '') },
    ];

    formats.forEach(({ format, expected }) => {
      it(`THEN it returns the correct formatted date for format: ${format}`, () => {
        const date = new Date('2021-01-01T00:00:00.000Z');
        const formattedDate = formatDate.withFormat(format, date);
        expect(formattedDate).toBe(expected(date));
      });
    });
  });
});
