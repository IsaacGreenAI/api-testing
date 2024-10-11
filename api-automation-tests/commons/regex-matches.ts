// #region id pattern matches
/**
 * Matches a UUID v4 string.
 * Example: "123e4567-e89b-12d3-a456-426614174000"
 */
export const uuidv4Match: RegExp = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
// #endregion

// #region Phone Number Matches
/**
 * Matches a US phone number without an extension.
 * Examples: "+1 123-456-7890", "123-456-7890", "(123) 456-7890"
 */
export const phoneNumberWithoutExtensionMatch: RegExp = /^(?:\+1\s?)?(\d{3}|\(\d{3}\))[-.\s]?\d{3}[-.\s]?\d{4}$/;

/**
 * Matches a US phone number with an optional extension.
 * Examples: "+1 123-456-7890 ext 1234", "123-456-7890 x1234", "(123) 456-7890 extension 1234"
 */
export const phoneNumberWithExtensionMatch: RegExp = /^(?:\+1\s?)?(\d{3}|\(\d{3}\))[-.\s]?\d{3}[-.\s]?\d{4}(?:\s?(?:ext|x|extension)\s?\d{1,5})?$/;
// #endregion

// #region date matches
/**
 * Matches a date in MM/DD/YY or MM-DD-YY format.
 * Examples: "12/31/99", "01-01-00", "02 28 21"
 */
export const mmDDyyMatch: RegExp = /^(0[1-9]|1[0-2])[\/\- ](0[1-9]|[12][0-9]|3[01])[\/\- ]\d{2}$/;

/**
 * Matches a date in MM/DD/YYYY or MM-DD-YYYY format.
 * Examples: "12/31/1999", "01-01-2000", "02 28 2021"
 */
export const mmDDyyyyMatch: RegExp = /^(0[1-9]|1[0-2])[\/\- ](0[1-9]|[12][0-9]|3[01])[\/\- ]\d{4}$/;
// #endregion

// #region Date Time by Standard Matches
/**
 * Matches an ISO 8601 date-time string.
 * Examples: "2023-10-05T14:48:00.000Z", "2023-10-05 14:48:00+02:00", "2023-10-05T14:48:00-07:00"
 */
export const isoDateTimeMatch: RegExp = /^\d{4}-[01]\d-[0-3]\d[T\s](?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-][01]\d:[0-5]\d)$/;

/**
 * Matches a UTC date-time string.
 * Examples: "2023-10-05T14:48:00.000Z", "2023-10-05T14:48:00Z"
 */
export const utcDateTimeMatch: RegExp = /^\d{4}-[01]\d-[0-3]\d[T\s](?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?Z$/;
// #endregion
