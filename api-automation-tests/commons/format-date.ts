/**
 * Creates a formatted date string based default of custom values
 * - Formatting requires these values for date-time: yyyy, yy, MM, dd, hh, mm, ss, fff
 *   - e.g. yyyy-MM-ddThh:mm:ss.fff yields 2024-01-01T00:00:00.000
 * - String dates must follow ISO 8601 format i.e. ISOString()
 * - 24 hour time format is used
 * - Default Values:
 *   - format: yyyy-MM-ddThh:mm:ss.fff
 *   - date: current date toIsoString()
 *   - timeZone: UTC
 */
export class FormatDate {
  private defaultTimeZone: string = 'UTC';
  private defaultFormat: string = 'yyyy-MM-ddThh:mm:ss.fff';

  private normalizeDate(date: Date | string): Date {
    switch (typeof date) {
    case 'string':
      return new Date(date);
    case 'object':
      return date;
    default:
      return new Date();
    }
  }

  private getDate(date?: Date | string, timeZone?: string): string {
    return this.normalizeDate(date).toLocaleDateString('en-US', { day: '2-digit', timeZone: timeZone ?? this.defaultTimeZone });
  }

  private getMonth(date?: Date | string, timeZone?: string): string {
    return this.normalizeDate(date).toLocaleDateString('en-US', { month: '2-digit', timeZone: timeZone ?? this.defaultTimeZone });
  }

  private getFullYear(date?: Date | string, timeZone?: string): string {
    return this.normalizeDate(date).toLocaleDateString('en-US', { year: 'numeric', timeZone: timeZone ?? this.defaultTimeZone });
  }

  private getLastTwoDigitsOfYear(date?: Date | string, timeZone?: string): string {
    return this.getFullYear(date, timeZone).slice(-2);
  }

  private getHours(date?: Date | string, timeZone?: string): string {
    const hours: string = this.normalizeDate(date).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', timeZone: timeZone ?? this.defaultTimeZone });
    return hours.slice(0, 2).padStart(2, '0');
  }

  private getMinutes(date?: Date | string, timeZone?: string): string {
    const minutes: string =  this.normalizeDate(date).toLocaleTimeString('en-US', { minute: '2-digit', timeZone: timeZone ?? this.defaultTimeZone });
    return minutes.padStart(2, '0');
  }

  private getSeconds(date?: Date | string, timeZone?: string): string {
    const seconds: string = this.normalizeDate(date).toLocaleTimeString('en-US', { second: '2-digit', timeZone: timeZone ?? this.defaultTimeZone });
    return seconds.padStart(2, '0');
  }

  private getMilliseconds(date?: Date | string, timeZone?: string): string {
    const milliseconds: string = this.normalizeDate(date).toLocaleTimeString('en-US', { fractionalSecondDigits: 3, timeZone: timeZone ?? this.defaultTimeZone });
    return milliseconds.padStart(3, '0');
  }

  public withFormat(dateFormat?: string, date?: Date | string, timeZone?: string): string {
    let formattedDate: string = dateFormat ?? this.defaultFormat;
    let dateToFormat: Date = this.normalizeDate(date);
    const timeZoneExpected: string = timeZone ?? this.defaultTimeZone;

    // date-time regex match
    const yearRegex: RegExp = /(y+)/gm;
    const monthRegex: RegExp = /(M+)/gm;
    const dayRegex: RegExp = /(d+)/gm;
    const hourRegex: RegExp = /(h+)/gm;
    const minuteRegex: RegExp = /(m+)/gm;
    const secondRegex: RegExp = /(s+)/gm;
    const millisecondRegex: RegExp = /(f){3}$/;

    // determine if we have a yyyy or yy format, and replace values
    const yearMatch = formattedDate.match(yearRegex)?.[0];
    if (yearMatch) {
      const yearFormatted = yearMatch.length === 4
        ? this.getFullYear(dateToFormat, timeZoneExpected)
        : this.getLastTwoDigitsOfYear(dateToFormat, timeZoneExpected);

      formattedDate = formattedDate.replace(yearRegex, yearFormatted);
    }

    if (formattedDate.match(monthRegex)) formattedDate = formattedDate.replace(monthRegex, this.getMonth(dateToFormat, timeZoneExpected));
    if (formattedDate.match(dayRegex)) formattedDate = formattedDate.replace(dayRegex, this.getDate(dateToFormat, timeZoneExpected));
    if (formattedDate.match(hourRegex)) formattedDate = formattedDate.replace(hourRegex, this.getHours(dateToFormat, timeZoneExpected));
    if (formattedDate.match(minuteRegex)) formattedDate = formattedDate.replace(minuteRegex, this.getMinutes(dateToFormat, timeZoneExpected));
    if (formattedDate.match(secondRegex)) formattedDate = formattedDate.replace(secondRegex, this.getSeconds(dateToFormat, timeZoneExpected));
    if (formattedDate.match(millisecondRegex)) formattedDate = formattedDate.replace(millisecondRegex, this.getMilliseconds(dateToFormat, timeZoneExpected));

    return formattedDate;
  }

  /**
   * Defualt format: MMyy
   */
  public likeCreditCardExpirationDate(format?: string, date?: Date | string, timeZone?: string): string {
    return this.withFormat(format ?? 'MMyy', date, timeZone);
  }

  /**
   * Defualt format: MM/dd/yyyy
   */
  public likeDateOfBirth(format?: string, date?: Date | string, timeZone?: string): string {
    return this.withFormat(format ?? 'MM/dd/yyyy', date, timeZone);
  }
}
