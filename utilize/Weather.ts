export function getDailyWeatherCondition(weatherCode: number): Promise<any> {
    return fetch(`https://api.foreca.net/data/favorites/${weatherCode}.json`)
        .then(res => res.json());
}

export function getRecentWeatherCondition(weatherCode: number): Promise<any> {
    return fetch(`https://api.foreca.net/data/recent/${weatherCode}.json`)
        .then(res => res.json());
}