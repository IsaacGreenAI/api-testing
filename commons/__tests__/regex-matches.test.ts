import { describe, it, expect } from 'vitest';
import {
  uuidv4Match, phoneNumberWithoutExtensionMatch, phoneNumberWithExtensionMatch,
  mmDDyyMatch, mmDDyyyyMatch, isoDateTimeMatch, utcDateTimeMatch
} from '../regex-matches.js';

describe('GiVEN the regex match expressions ', () => {

  describe('WHEN the uuidv4Match is compared', () => {
    it('THEN it matches on a UUIDv4 string', () => {
      expect(uuidv4Match.test('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(uuidv4Match.test('123e4567-e89b-12d3-a456-42661417400')).toBe(false);
    });
  });

  describe('WHEN the phoneNumberWithoutExtensionMatch is compared', () => {
    it('THEN it matches on a phone number without an extension', () => {
      expect(phoneNumberWithoutExtensionMatch.test('+1 123-456-7890')).toBe(true);
      expect(phoneNumberWithoutExtensionMatch.test('123-456-7890')).toBe(true);
      expect(phoneNumberWithoutExtensionMatch.test('(123) 456-7890')).toBe(true);
      expect(phoneNumberWithoutExtensionMatch.test('1234567890')).toBe(true);
      expect(phoneNumberWithoutExtensionMatch.test('1234567890 x1234')).toBe(false);
    });
  });

  describe('WHEN the phoneNumberWithExtensionMatch is compared', () => {
    it('THEN it matches on a phone number with an extension', () => {
      expect(phoneNumberWithExtensionMatch.test('+1 123-456-7890 ext 1234')).toBe(true);
      expect(phoneNumberWithExtensionMatch.test('123-456-7890 x1234')).toBe(true);
      expect(phoneNumberWithExtensionMatch.test('(123) 456-7890 extension 1234')).toBe(true);
      // we still want to be able to accept numbers without extensions
      expect(phoneNumberWithExtensionMatch.test('123-456-7890')).toBe(true);
      expect(phoneNumberWithExtensionMatch.test('1234567890')).toBe(true);
    });
  });

  describe('WHEN the mmDDyyMatch is compared', () => {
    it('THEN it matches on MM/DD/YY date format', () => {//todo: fix the test
      expect(mmDDyyMatch.test('12/31/99')).toBe(true);
      expect(mmDDyyMatch.test('01-01-00')).toBe(true);
      expect(mmDDyyMatch.test('02 28 21')).toBe(true);
      expect(mmDDyyMatch.test('13/31/99')).toBe(false);
    });
  });

  describe('WHEN the mmDDyyyyMatch is compared', () => {
    it('THEN it matches on MM/DD/YYYY date format', () => {
      expect(mmDDyyyyMatch.test('12/31/1999')).toBe(true);
      expect(mmDDyyyyMatch.test('01-01-2000')).toBe(true);
      expect(mmDDyyyyMatch.test('02 28 2021')).toBe(true);
      expect(mmDDyyyyMatch.test('13/31/1999')).toBe(false);
    });
  });

  describe('WHEN the isoDateTimeMatch is compared', () => {
    it('THEN it matches on a ISO 8601 date-time format', () => {
      expect(isoDateTimeMatch.test('2023-10-05T14:48:00.000Z')).toBe(true);
      expect(isoDateTimeMatch.test('2023-10-05 14:48:00+02:00')).toBe(true);
      expect(isoDateTimeMatch.test('2023-10-05T14:48:00-07:00')).toBe(true);
      expect(isoDateTimeMatch.test('2023-10-05T14:48:00')).toBe(false);
    });
  });

  describe('WHEN the utcDateTimeMatch is compared', () => {
    it('THEN it matches on a UTC date-time format', () => {
      expect(utcDateTimeMatch.test('2023-10-05T14:48:00.000Z')).toBe(true);
      expect(utcDateTimeMatch.test('2023-10-05T14:48:00Z')).toBe(true);
      expect(utcDateTimeMatch.test('2023-10-05T14:48:00')).toBe(false);
    });
  });
});
