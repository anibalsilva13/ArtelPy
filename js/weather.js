const DEFAULT_LOCATION = {
    city: "Carapeguá",
    latitude: -25.8,
    longitude: -56.82
};

const WEATHER_CODES = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina",
    51: "Llovizna leve",
    53: "Llovizna",
    55: "Llovizna intensa",
    61: "Lluvia leve",
    63: "Lluvia",
    65: "Lluvia intensa",
    71: "Nieve leve",
    73: "Nieve",
    75: "Nieve intensa",
    80: "Chaparrones leves",
    81: "Chaparrones",
    82: "Chaparrones intensos",
    95: "Tormenta",
    96: "Tormenta con granizo",
    99: "Tormenta fuerte"
};

export async function getWeather() {
    let location;

    try {
        location = await getLocationByIP();
    } catch (error) {
        console.warn(
            "No se pudo detectar la ubicación. Se utilizará Carapeguá.",
            error
        );

        location = DEFAULT_LOCATION;
    }

    try {
        return await buildWeather(location);
    } catch (error) {
        if (location === DEFAULT_LOCATION) {
            throw error;
        }

        console.warn(
            "No se pudo consultar el clima de la ubicación detectada. Se utilizará Carapeguá.",
            error
        );

        return buildWeather(DEFAULT_LOCATION);
    }
}

async function getLocationByIP() {
    const data = await fetchJSON(
        "https://ipapi.co/json/"
    );

    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new Error(
            "La API de ubicación no devolvió coordenadas válidas."
        );
    }

    return {
        city:
            data.city ||
            data.region ||
            "Tu ubicación",
        latitude,
        longitude
    };
}

async function buildWeather(location) {
    const weather =
        await getCurrentWeather(
            location.latitude,
            location.longitude
        );

    return {
        city: location.city,
        temperature: weather.temperature,
        description:
            WEATHER_CODES[
                weather.weatherCode
            ] || "Clima actual",
        icon: getWeatherIcon(
            weather.weatherCode,
            weather.isDay
        )
    };
}

async function getCurrentWeather(
    latitude,
    longitude
) {
    const url = new URL(
        "https://api.open-meteo.com/v1/forecast"
    );

    url.searchParams.set(
        "latitude",
        latitude
    );

    url.searchParams.set(
        "longitude",
        longitude
    );

    url.searchParams.set(
        "current_weather",
        "true"
    );

    url.searchParams.set(
        "timezone",
        "auto"
    );

    const data =
        await fetchJSON(url);

    if (!data.current_weather) {
        throw new Error(
            "La API meteorológica no devolvió datos actuales."
        );
    }

    return {
        temperature:
            Math.round(
                data.current_weather.temperature
            ),

        weatherCode:
            data.current_weather.weathercode,

        isDay:
            Boolean(
                data.current_weather.is_day
            )
    };
}

function getWeatherIcon(code, isDay) {
    if (code === 0) {
        return isDay
            ? "sun"
            : "moon";
    }

    if (
        [1, 2, 3, 45, 48]
            .includes(code)
    ) {
        return "cloud";
    }

    if (
        [
            51,
            53,
            55,
            61,
            63,
            65,
            80,
            81,
            82
        ].includes(code)
    ) {
        return "rain";
    }

    if (
        [71, 73, 75]
            .includes(code)
    ) {
        return "snow";
    }

    if (
        [95, 96, 99]
            .includes(code)
    ) {
        return "storm";
    }

    return "cloud";
}

async function fetchJSON(
    url,
    timeout = 10000
) {
    const controller =
        new AbortController();

    const timeoutId =
        setTimeout(
            () => controller.abort(),
            timeout
        );

    try {
        const response =
            await fetch(url, {
                signal:
                    controller.signal,
                cache:
                    "no-store"
            });

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        return await response.json();
    } finally {
        clearTimeout(timeoutId);
    }
}