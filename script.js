const apiKey = '22d0d117485709263929483f32ab3d4d'
let unit = 'metric'
let kindUnit = 'C'
let toggle = false
let cityName = 'Madrid'
const toggleBtn = document.querySelector('.toggle')
const searchForm = document.querySelector('.searchForm')
const cityNameInput = document.getElementById('cityNameInput')
const btn = document.querySelector('.btn')
const display = document.querySelector('.display')

searchForm.addEventListener('submit', e => {
    e.preventDefault()
})

btn.addEventListener('click', () =>{
    showWeather()
    cityNameInput.value = ''
})

toggleBtn.addEventListener('click', () => {
    if (toggle == false) {unit = 'imperial'; kindUnit = 'F'; toggle = true; showWeather(cityName)}
    else if (toggle == true) {unit = 'metric'; kindUnit = 'C'; toggle = false; showWeather(cityName)}
})

function timeConverter(UNIX_timestamp){
    let date = new Date(UNIX_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

const showWeather = async function(option) {
    try{
        let cityName
        if (cityNameInput.value !== '') {cityName = cityNameInput.value}
        option? cityName = option : cityName = cityNameInput.value
        const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${apiKey}`)
        const response = await request.json()
        let rainy
        (response.rain === undefined ) ?  rainy = 0 : rainy = response.rain['1h']
        const data = {
            name: response.name,
            actualTemp: response.main.temp,
            maxTemp: response.main.temp_max,
            minTemp: response.main.temp_min,
            feels: response.main.feels_like,
            clouds: response.clouds.all,
            skyCond: response.weather[0].description[0].toUpperCase() + response.weather[0].description.substring(1),
            rain: rainy,
            sunrise: timeConverter(response.sys.sunrise),
            sunset: timeConverter(response.sys.sunset)
        }

        let result =
            `<div class='main'>
                <h3>${data.name} </h3>
                <div>${Math.floor(data.actualTemp)}<span>\u00B0${kindUnit}</span></div>
            </div>
            <ul>
                <li>Real Feel: ${Math.floor(data.feels)}\u00B0${kindUnit}</li>
                <li>Max: ${Math.floor(data.maxTemp)}\u00B0${kindUnit}</li>
                <li>Min: ${Math.floor(data.minTemp)}\u00B0${kindUnit}</li>
                <br>
                <li>Sky Conditions: ${data.skyCond}</li>
                <li>Clouds (%): ${data.clouds}</li>
                <li>Precipitation: ${data.rain} mm</li>
                <br>
                <li>Sunrise Time: ${data.sunrise}</li>
                <li>Sunset Time: ${data.sunset}</li>
            </ul>`
        display.innerHTML = result
        cityNameInput.value = ''
        console.log(response)
    }
    catch(err){
        alert("Sorry, that city doesn't exist")
    }
}
showWeather('Madrid')  