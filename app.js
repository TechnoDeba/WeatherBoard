const cityInput=document.querySelector(".city-input");
const searchBtn=document.querySelector(".search-btn");
const weatherCard=document.querySelector(".card-container");
const primeWeatherCard=document.querySelector(".current-weather");
const apiKey= "dab42f5e09c98c4f8891be1028abb615";
const apiUrl= "https://api.openweathermap.org/data/2.5/weather?units=metric&q=Lima";
const currLocBtn=document.querySelector("#location-btn");
 const seher=document.querySelector(".city-name");
 const imgChange=document.querySelector("#flag");
const fillWeatherCard = ( weatherItem,index,cityName) => {
if(index!=0){
    return `
    <div class="weather-card">
     <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="./images/${weatherItem.weather[0].main}.png" alt="pic">
     <h3>Temperature:${(weatherItem.main.temp -273.15).toFixed(2)}°C</h3>
     <h3>Wind:${weatherItem.wind.speed}M/S</h3>
     <h3>Humidity:${weatherItem.main.humidity}%</h3>
             </div>`;
  
}
else {
return `
<div class="details">
        <h2 class="city-name">${cityName}   (${weatherItem.dt_txt.split(" ")[0]})   </h2>
        <h3 class="tempu">Temperature:${(weatherItem.main.temp -273.15).toFixed(2)}°C</h3>
        <h3 class="windu" >Wind:${weatherItem.wind.speed}M/S</h3>
        <h3 class="humu">Humidity:${weatherItem.main.humidity}%</h3>
    </div>
    <div class="icon">
        <img src="./images/${weatherItem.weather[0].main}.png" alt="pic">
        <h3>${weatherItem.weather[0].description}</h3>
    </div>
`;

}
}




const weatherDetector = (name,lat,lon) => {
const apidailyUrl=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
fetch(apidailyUrl).then(res => res.json()).then(data=> {
const uniqueForeecastDays=[];
const fiveDaysForecast= data.list.filter(forecast => {
  const forecastDate=new Date(forecast.dt_txt).getDate();
  if(!uniqueForeecastDays.includes(forecastDate)){
     return uniqueForeecastDays.push(forecastDate);
  }
});
 

primeWeatherCard.innerHTML="";
weatherCard.innerHTML="";

console.log(fiveDaysForecast);
fiveDaysForecast.forEach((weatherItem,index) => {
  const cityName=cityInput.value.trim();
  if(index===0){
primeWeatherCard.insertAdjacentHTML("beforeend",fillWeatherCard(weatherItem,index,cityName));
  }
  else {
    weatherCard.insertAdjacentHTML("beforeend",fillWeatherCard(weatherItem,index,cityName));
  }
  cityInput.value="";
});

}).catch(() => {
  alert("An error occured while fetching the weather update");
 });
}
  



const cityDetector=() =>{
  const cityName=cityInput.value.trim();
   if(!cityName)
    return;
   const geoLink=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}` ; 

   fetch(geoLink).then(res => res.json()).then(data => {
    if(!data.length) 
      return alert(`No coordinates found for ${cityName}`);
    const{ name,lat,lon,country}=data[0];
    imgChange.src=`https://flagsapi.com/${country}/flat/64.png`
    weatherDetector(name,lat,lon);
   }).catch(() => {
    alert("An error occured while fetching the coordinates");
   });
}


const userLocation=() => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const {latitude,longitude} = position.coords;
      const geoUrl=`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
      fetch(geoUrl).then(res => res.json()).then(data => {
        const{ name,local_names,country
        }=data[0];
    weatherDetector(name,latitude,longitude);
    cityInput.value=local_names.bn;    
    imgChange.src=`https://flagsapi.com/${country}/flat/64.png`;
       }).catch(() => {
        alert("An error occured while fetching the city");
       });
    
    },
    error => {
      if(error.code===error.PERMISSION_DENIED){
        alert("Geolocaton request denied.Please reset location permission to grant access");
      }
    }
  )
}



searchBtn.addEventListener("click",cityDetector);
currLocBtn.addEventListener("click",userLocation);