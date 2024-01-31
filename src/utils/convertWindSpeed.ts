/** @format */

export function convertWindSpeed(speedInMetersPerSecond: number): string {
    const speedInKilometersPerSecond = speedInMetersPerSecond * 3.6;
    return `${speedInKilometersPerSecond.toFixed(0)} km/h`;
}