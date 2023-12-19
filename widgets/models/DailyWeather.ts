export interface IWeatherInfo {
    time?: number;
    symbol?: string;
    temperature?: number;
    feelsLike?: number;
    humidity?: number;
    pressure?: number;
    windSpeed?: number;
    maxWindSpeed?: number;
    windDegree?: number;
    rainAmount?: number;
    rainPercent?: number;
    uvi?: number;
}

export interface IDailyWeather extends IWeatherInfo {
    temperatureMax?: number;
    temperatureMin?: number;
    dayLength?: string;
    sunrise?: string;
    sunset?: string;
}

export interface IForecaWeatherInfo {
    flike?: number;
    flikeFCA?: number;
    maxwind?: number;
    pres?: number;
    rain?: number;
    date?: string;
    rainl?: number;
    rainp?: number;
    rains?: number;
    rhum?: number;
    symb?: string;
    temp?: number;
    time?: number;
    uvi?: number;
    windd?: number;
    winds?: number;
    sunrise?: string;
    sunset?: string;
}

export interface IDailyForcaWeather extends IForecaWeatherInfo {
    tmin?: number;
    tmax?: number;
    daylen?: string;
    sunrise?: string;
    sunset?: string;
}

export interface IDailyForcaWeatherResponse {
    weatherRecent?: IForecaWeatherInfo;
    dailyWeather?: IDailyForcaWeather[];
}
