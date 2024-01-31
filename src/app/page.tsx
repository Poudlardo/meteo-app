/** @format */

"use client"

import Image from "next/image";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import WeatherIcon from "../components/WeatherIcon";
import WeatherDetail from "../components/WeatherDetail";
import { useQuery } from "react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { frCA } from 'date-fns/locale'
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometer";
import { convertWindSpeed } from '@/utils/convertWindSpeed'
import ForecastWeatherDetail from '@/components/ForecastWeatherDetail'
// https://api.openweathermap.org/data/2.5/forecast?q=paris&appid=ab3d50bb4076753a86aa1335ddf0fd3a&cnt=56

type WeatherApiResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

type WeatherEntry = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
};

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Home() {

  const { isLoading, error, data } = useQuery<WeatherApiResponse>('repoData', async () => 
  {

    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=paris&appid=${API_KEY}&cnt=56`)
    return data;
  }

);
console.log("data", data?.city.name)

const uniqueDates = [
  ...new Set(data?.list.map(
    (entry) => new Date(entry.dt * 1000).toISOString().split('T')[0]
  ))
]

const firstDataForEachDate = uniqueDates.map((date) => {
  return data?.list.find((entry) => {
    const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
    const entryTime = new Date(entry.dt * 1000).getHours();
    return entryDate === date && entryTime >= 6;
  })
})

const firstData = data?.list[0];

if (isLoading) 
  return (
  <div className="flex items-center min-h-screen justify-center">
    <p className="animate-bounce">Loading...</p>
  </div>
  );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar /> 
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/** Today data */}
        <section className="space-y-4">
          <div>
          <h2 className="flex gap-1 text-2xl items-end py-4">
            <p>{format(parseISO(firstData?.dt_txt ?? ""), `EEEE d MMMM yyyy`, { locale: frCA })}</p>
          </h2>
          <Container className="gap-10 px-6 items-center">
            {/** temperature */}
            <div className="flex flex-col px-4">
              <span className="text-5xl">
                {convertKelvinToCelsius(firstData?.main.temp ?? 284.26)}°
              </span>
              <p className="text-xs space-x-1 whitespace-nowrap">
                <span>Ressenti</span>
                <span>
                {convertKelvinToCelsius(firstData?.main.feels_like ?? 284.26)}°
                </span>
              </p>
              <p className="text-xs space-x-2">
              <span>
                {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                °↓{" "}
              </span>
              <span>
              {" "}
              {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
              °↑
              </span>
              </p> 
            </div>
            {/** time and weather icon */}
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {data?.list.map((d, i) => 
              <div
              key={i}
              className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
              >
              <p>
                {format(parseISO(d.dt_txt), 'HH:mm')}
              </p>
              {/** <WeatherIcon iconName={d.weather[0].icon}/> */}
              <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}/>
              <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
              </div>
              )}
            </div>
          </Container>
          </div>
          <div className="flex gap-10">
            {/** left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
            <p className="capitalize text-center">
              {firstData?.weather[0].description}{" "}
            </p>
            <WeatherIcon 
            iconName={getDayOrNightIcon(
              firstData?.weather[0].icon ?? "",
              firstData?.dt_txt ?? ""
            )}
            /> 
            </Container>
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
            <WeatherDetail
            visability={metersToKilometers(firstData?.visibility ?? 10000)}
            airPressure={`${firstData?.main.pressure} hPa`}
            humidity={`${firstData?.main.humidity}%`}
            sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949), "H:mm")}
            sunset={format(fromUnixTime(data?.city.sunset ?? 1702949), "H:mm")}
            windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
            />
            </Container>
            {/** right */}
          </div>
        </section>
        {/** 7 days forecast data*/}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">
            Prévision des 7 prochains jours
          </p>
          {firstDataForEachDate.map((d, i) => (
            <ForecastWeatherDetail 
              key={i}
              description={d?.weather[0].description ?? ""}
              weatherIcon={d?.weather[0].icon ?? "01d"}
              date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
              day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
              temp={d?.main.temp ?? 0}
              feels_like={d?.main.feels_like ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              visability={metersToKilometers(d?.visibility ?? 10000)}
              airPressure={`${firstData?.main.pressure} hPa`}
              humidity={`${firstData?.main.humidity}%`}
              sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949), "H:mm")}
              sunset={format(fromUnixTime(data?.city.sunset ?? 1702949), "H:mm")}
              windSpeed={convertWindSpeed(d?.wind.speed ?? 1.64)}
             />
          ))}
        </section>
      </main>
    </div>
  );
}
