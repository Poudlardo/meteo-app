/** @format */


export function getDayOrNightIcon(
  iconname: string,
  dateTimeString:string
  ): string {
    const hours = new Date(dateTimeString).getHours();
    const isDayTime = hours >= 6 && hours < 18; // day time is between 6 AM and 6 PM
    return isDayTime ? iconname.replace(/.$/, 'd') : iconname.replace(/.$/, 'n');
  }