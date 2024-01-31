import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';

type Props = {};

export interface WeatherDetailProps {
    visability: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetail(props: WeatherDetailProps) {
   const {
    visability = "25km",
    humidity = "61%",
    windSpeed = "7 km/h",
    airPressure = "1012 hPa",
    sunrise= "6.20",
    sunset = "18:48"
   } = props;

   return (
        <>
            <SingleWeatherDetail icon={<LuEye />} information='Visibilité' value={props.visability} />
            <SingleWeatherDetail icon={<FiDroplet />} information='Humidité' value={props.humidity} />
            <SingleWeatherDetail icon={<MdAir />} information='Vents' value={props.windSpeed} />
            <SingleWeatherDetail icon={<ImMeter />} information="Pression de l'air" value={props.airPressure} />
            <SingleWeatherDetail icon={<LuSunrise />} information='Lever du soleil' value={props.sunrise} />
            <SingleWeatherDetail icon={<LuSunset />} information='Coucher du soleil' value={props.sunset} />
        </>

    )

}

export interface SingleWeatherDetailProps {
    information: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
    return (
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'>{props.information}</p>
            <div className='text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}