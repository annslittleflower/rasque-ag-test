import { useQuery, useQueryClient } from '@tanstack/react-query';

export type WeatherData = {
  city: string;
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  isSunny: boolean;
  isRainy: boolean;
  isClouds: boolean;
  isSnow: boolean;
  windSpeed: number;
};

export type WeatherResponse = {
  weather: [
    {
      main: string;
    }
  ];
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
};

const useWeatherData = (city: string) => {
  const queryClient = useQueryClient();

  const result = useQuery({
    enabled: !!city,
    queryKey: ['weatherData', city],
    queryFn: async () => {
      const presentData: WeatherData | undefined = queryClient.getQueryData([city]);

      if (presentData) {
        return presentData;
      }

      const geoResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${
          import.meta.env.VITE_API_URL
        }`
      );

      if (!geoResponse.ok) {
        throw new Error('something is wrong, try again later');
      }

      const geoData = (await geoResponse.json()) as WeatherResponse;

      const weatherData: WeatherData = {
        city,
        currentTemp: geoData.main.temp,
        minTemp: geoData.main.temp_min,
        maxTemp: geoData.main.temp_max,
        isSunny: geoData.weather[0].main === 'Clear',
        isRainy: geoData.weather[0].main === 'Rain',
        isClouds: geoData.weather[0].main === 'Clouds',
        isSnow: geoData.weather[0].main === 'Snow',
        windSpeed: geoData.wind.speed,
      };

      queryClient.setQueryData([city], weatherData);
      return weatherData;
    },
  });

  return result;
};

export default useWeatherData;