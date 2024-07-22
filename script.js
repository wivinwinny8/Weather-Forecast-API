const API="599133752e2b213d6e6797efa3ff0f1a";
var intervalId=0;
async function getData(){
    clearInterval(intervalId);
    try{
        const cityName = document.getElementById("search").value;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API}`;

        if(cityName==""){
            throw new Error("Please enter city");
        }

        const response = await fetch(url);
        if(response.ok==false){
            throw new Error("Error fetching")
        }
        else{
            const result = await response.json();
            console.log(result);
            setValue(result);
        }
    }
    catch(error){
        console.log(error);
    }
}

function setValue(result){
    const date = new Date();
    
    //SETTING VALUES OF LEFT BOX
    document.getElementById("location").textContent = result.name;
    document.getElementById("tempvalue").textContent = `${(result.main.temp-273.15).toFixed(0)}`;
    document.getElementById("desc").textContent= result.weather[0].description;
    updateTimeData(result.timezone);

    //SETTING ICON VALUES
    setIcon(result.timezone,result.weather[0].main);

    //SETTING VALUES OF RIGHT BOX

    //SETTING VALUE OF WIND 
    document.getElementById("winddata").textContent = `${result.wind.speed} m/s`;
    document.getElementById("windresult").textContent = `Towards ${setWindDirection(result.wind.deg)}`;

    //SETTING VALUE OF HUMIDITY
    document.getElementById("humiditydata").textContent = `${result.main.humidity} %`;

    //SETTING VALUE OF FEEL LIKE TEMPERATURE
    document.getElementById("feeldata").textContent = `${(result.main.feels_like-273.15).toFixed(0)} °C`;

    //SETTING VALUE OF VISIBLITY
    document.getElementById("visiblitydata").textContent = `${(result.visibility/1000).toFixed(0)} km`;
    document.getElementById("visiblityresult").textContent = setVisiblityResult(result.visibility);

    //SETTING VALUE OF PRESSURE
    document.getElementById("pressuredata").textContent = `${(result.main.pressure).toFixed(0)} hPa`;

    //SETTING VALUE OF CLOUDLINESS
    document.getElementById("clouddata").textContent = `${result.clouds.all} %`;

    //SETTING VALUES OF TEMPERATURE RANGE
    document.getElementById("maxtemp").textContent=`${(result.main.temp_max-273.15).toFixed(0)} °C`;
    document.getElementById("mintemp").textContent=`${(result.main.temp_min-273.15).toFixed(0)} °C`;

    //SETTING VALUES OF SUNRISE AND SUNSET
    document.getElementById("sunrise").textContent = setSunRiseAndSunSet(result.sys.sunrise,result.timezone);
    document.getElementById("sunset").textContent = setSunRiseAndSunSet(result.sys.sunset,result.timezone);   
    
    //SETTING VALUE OF DEW POINT
    document.getElementById("dewpoint").textContent = `${((result.main.temp-273.15)-((100-result.main.humidity)/5)).toFixed()} °C`;
}

function setMonth(month){
    switch(month){
        case 0: return "January";
        case 1: return "February";
        case 2: return "March";
        case 3: return "April";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "August";
        case 8: return "September";
        case 9: return "October";
        case 10: return "November";
        case 11: return "December";
    }
}

function setDay(day){
    switch(day){
        case 0: return "Sunday"
        case 1: return "Monday"
        case 2: return "Tuesday"
        case 3: return "Wednesday"
        case 4: return "Thursday"
        case 5: return "Friday"
        case 6: return "Saturday"
    }
}

function updateTimeData(data){
    intervalId = setInterval(updateTime,1000,data);
}

function updateTime(tz){
    d = new Date()
    localTime = d.getTime()
    localOffset = d.getTimezoneOffset() * 60000
    utc = localTime + localOffset
    var atlanta = utc + (1000 * tz)
    date = new Date(atlanta)
    document.getElementById("day").textContent = date.getDate();
    document.getElementById("month").textContent = setMonth(date.getMonth());
    document.getElementById("year").textContent = date.getFullYear();
    document.getElementById("dayname").textContent = setDay(date.getDay());
    document.getElementById("time").textContent = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    console.log(date.getHours());
    if(date.getHours()>=6&&date.getHours()<12){
        document.getElementById("timeoftheday").textContent = "Morning";
    }
    else if(date.getHours()>=12&&date.getHours()<16){
        document.getElementById("timeoftheday").textContent = "Afternoon";
    }
    else if(date.getHours()>=16&&date.getHours()<19){
        document.getElementById("timeoftheday").textContent = "Evening";
    }
    else if(date.getHours()>=19&&date.getHours()<6){
        document.getElementById("timeoftheday").textContent = "Night";
    }
    else{
        document.getElementById("timeoftheday").textContent = "Night";
    }

}


function setWindDirection(degree){
    if(degree==0 || degree==360){
        return "North";
    }
    else if(degree>0 && degree<90){
        return "North East";
    }
    else if(degree==90){
        return "East";
    }
    else if(degree>90 && degree<180){
        return "South East";
    }
    else if(degree==180){
        return "South";
    }
    else if(degree>180 && degree<270){
        return "South West";
    }
    else if(degree==270){
        return "West";
    }
    else if(degree>270 && degree<360){
        return "North West";
    }
}

function setVisiblityResult(data){
    range=data/1000;
    if(range>=0&&range<=0.05){
        return "Dense Fog";
    }
    else if(range>0.05&&range<=0.2){
        return "Thick Fog";
    }
    else if(range>0.2&&range<=0.5){
        return "Moderate Fog";
    }
    else if(range>0.5&&range<=1){
        return "Light Fog";
    }
    else if(range>1&&range<=2){
        return "Thin Fog";
    }
    else if(range>2&&range<=4){
        return "Haze";
    }
    else if(range>4&&range<9){
        return "Light Haze";
    }
    else if(range==9){
        return "Clear";
    }
    else if(range>=10){
        return "Very Clear";
    }
}

function setSunRiseAndSunSet(unixTimestamp, timezoneOffset) {
    const clientOffset = new Date().getTimezoneOffset();
    const offsetTimestamp = (unixTimestamp + (clientOffset * 60) + timezoneOffset)
    var date = new Date(offsetTimestamp * 1000);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function setIcon(tz,condition){
    const icon=document.getElementById("icon");
    d = new Date()
    localTime = d.getTime()
    localOffset = d.getTimezoneOffset() * 60000
    utc = localTime + localOffset
    var atlanta = utc + (1000 * tz)
    date = new Date(atlanta)
    hour=date.getHours();
    if(hour>=6&&hour<=18){
        switch(condition){
            case "Rain":
                icon.load("/animations/rain-day.json");
                break;
            case "Clear":
                icon.load("/animations/clear-day.json");
                break;
            case "Clouds":
                icon.load("/animations/clouds-day.json");
                break;
            case "Snow":
                icon.load("/animations/snow-day.json");
                break;
            case "Drizzle":
                icon.load("/animations/drizzle-day.json");
                break;
            case "Thunderstorm":
                icon.load("/animations/thunderstorm-day.json");
                break;
            default:
                icon.load("/animations/other-day.json")
                break;
        }
    }
    else{
        switch(condition){
            case "Rain":
                icon.load("/animations/rain-night.json");
                break;
            case "Clear":
                icon.load("/animations/clear-night.json");
                break;
            case "Clouds":
                icon.load("/animations/clouds-night.json");
                break;
            case "Snow":
                icon.load("/animations/snow-night.json");
                break;
            case "Drizzle":
                icon.load("/animations/drizzle-night.json");
                break;
            case "Thunderstorm":
                icon.load("/animations/thunderstorm-night.json");
                break;
            default:
                icon.load("/animations/other-night.json")
                break;
        }
    }

}