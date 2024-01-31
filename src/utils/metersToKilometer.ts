

export function metersToKilometers(visabilityInMeter: number): string {
    const visibilityInKilometers = visabilityInMeter / 1000;
    return `${visibilityInKilometers.toFixed(0)} km`
}