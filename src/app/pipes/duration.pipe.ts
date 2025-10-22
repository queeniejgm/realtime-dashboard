import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  /**
   * Transform a duration value in minutes into a human-readable format
   * @param value - Duration in minutes
   * @param inputUnit - Unit of the input value (default: 'minutes')
   * @returns Human-readable duration string
   */
  transform(value: number | null | undefined, inputUnit: 'seconds' | 'minutes' | 'hours' = 'minutes'): string {
    if (value == null || isNaN(value) || value < 0) {
      return '0s';
    }

    // Convert to seconds for easier calculation
    let totalSeconds = this.convertToSeconds(value, inputUnit);

    // Define time units in seconds
    const timeUnits = [
      { unit: 'y', seconds: 365.25 * 24 * 60 * 60 }, // year (accounting for leap years)
      { unit: 'mo', seconds: 30.44 * 24 * 60 * 60 }, // month (average)
      { unit: 'w', seconds: 7 * 24 * 60 * 60 },      // week
      { unit: 'd', seconds: 24 * 60 * 60 },           // day
      { unit: 'h', seconds: 60 * 60 },                // hour
      { unit: 'm', seconds: 60 },                     // minute
      { unit: 's', seconds: 1 }                       // second
    ];

    const parts: string[] = [];

    for (const { unit, seconds } of timeUnits) {
      if (totalSeconds >= seconds) {
        const count = Math.floor(totalSeconds / seconds);
        parts.push(`${count}${unit}`);
        totalSeconds -= count * seconds;
      }

      // Limit to the 2 most significant units for readability
      if (parts.length === 2) {
        break;
      }
    }

    return parts.length > 0 ? parts.join(' ') : '0s';
  }

  private convertToSeconds(value: number, unit: 'seconds' | 'minutes' | 'hours'): number {
    switch (unit) {
      case 'hours':
        return value * 3600;
      case 'minutes':
        return value * 60;
      case 'seconds':
      default:
        return value;
    }
  }
}

