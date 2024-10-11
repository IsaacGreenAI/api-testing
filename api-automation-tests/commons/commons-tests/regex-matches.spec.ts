import {
  uuidv4Match, phoneNumberWithoutExtensionMatch, phoneNumberWithExtensionMatch,
  mmDDyyMatch, mmDDyyyyMatch, isoDateTimeMatch, utcDateTimeMatch
} from '../regex-matches';

describe('regex matches', () => {
  test('UUID v4 match', () => {
    expect(uuidv4Match.test('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(uuidv4Match.test('123e4567-e89b-12d3-a456-42661417400')).toBe(false);
  });

  test('Phone number without extension match', () => {
    expect(phoneNumberWithoutExtensionMatch.test('+1 123-456-7890')).toBe(true);
    expect(phoneNumberWithoutExtensionMatch.test('123-456-7890')).toBe(true);
    expect(phoneNumberWithoutExtensionMatch.test('(123) 456-7890')).toBe(true);
    expect(phoneNumberWithoutExtensionMatch.test('1234567890')).toBe(true);
    expect(phoneNumberWithoutExtensionMatch.test('1234567890 x1234')).toBe(false);
  });

  test('Phone number with extension match', () => {
    expect(phoneNumberWithExtensionMatch.test('+1 123-456-7890 ext 1234')).toBe(true);
    expect(phoneNumberWithExtensionMatch.test('123-456-7890 x1234')).toBe(true);
    expect(phoneNumberWithExtensionMatch.test('(123) 456-7890 extension 1234')).toBe(true);
    // we still want to be able to accept numbers without extensions
    expect(phoneNumberWithExtensionMatch.test('123-456-7890')).toBe(true);
    expect(phoneNumberWithExtensionMatch.test('1234567890')).toBe(true);
  });

  test('MM/DD/YY match', () => {
    expect(mmDDyyMatch.test('12/31/99')).toBe(true);
    expect(mmDDyyMatch.test('01-01-00')).toBe(true);
    expect(mmDDyyMatch.test('02 28 21')).toBe(true);
    expect(mmDDyyMatch.test('13/31/99')).toBe(false);
  });

  test('MM/DD/YYYY match', () => {
    expect(mmDDyyyyMatch.test('12/31/1999')).toBe(true);
    expect(mmDDyyyyMatch.test('01-01-2000')).toBe(true);
    expect(mmDDyyyyMatch.test('02 28 2021')).toBe(true);
    expect(mmDDyyyyMatch.test('13/31/1999')).toBe(false);
  });

  test('ISO 8601 date-time match', () => {
    expect(isoDateTimeMatch.test('2023-10-05T14:48:00.000Z')).toBe(true);
    expect(isoDateTimeMatch.test('2023-10-05 14:48:00+02:00')).toBe(true);
    expect(isoDateTimeMatch.test('2023-10-05T14:48:00-07:00')).toBe(true);
    expect(isoDateTimeMatch.test('2023-10-05T14:48:00')).toBe(false);
  });

  test('UTC date-time match', () => {
    expect(utcDateTimeMatch.test('2023-10-05T14:48:00.000Z')).toBe(true);
    expect(utcDateTimeMatch.test('2023-10-05T14:48:00Z')).toBe(true);
    expect(utcDateTimeMatch.test('2023-10-05T14:48:00')).toBe(false);
  });
});
