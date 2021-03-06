import { ICityWeather } from './../models/IWeatherData.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IWeatherRawData } from '../models/IWeatherRawData.interface';
import { ISearchResult, IWeatherData } from '../models/IWeatherData.interface';
import {Subject, Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private rawData: IWeatherRawData;

  cityDetails = new Subject<IWeatherData>();
  cityDetailChange = this.cityDetails.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  baseUrl = 'https://cors-anywhere.herokuapp.com/https://www.metaweather.com';


  searchLocation(term): Observable<ISearchResult[]> {
    /*
      CHALLANGE
       - get list of cities based on the searched string
       sample url: baseUrl/api/location/search/query=paris
    */

    return this.http.get<ISearchResult[]>(this.baseUrl + '/api/location/search/?query=' + term);

  }

  getCityDetails(woeid): Observable<IWeatherData> {


    /*
      woeid is the city id(number).
      you can use below sample url to fetch the city weather details
      sample url : baseUrl/api/location/111111
    */

    /*
      CHALLENGE
       - fetch the city weather data
       - transform the received data to required "IWeatherData" format using transformRawData() func
    */

    this.http.get<IWeatherRawData>(this.baseUrl + '/api/location/' + woeid).subscribe(data => {
      this.rawData = data;
      this.cityDetails.next(this.transformRawData(this.rawData));
    });
    return this.cityDetailChange;
  }

  transformRawData(rawData: IWeatherRawData) {
    const transformedWeather: Array<ICityWeather> = [];

    rawData.consolidated_weather.forEach(function(obj) {
      const date = obj.applicable_date;
      const temperature = obj.the_temp;
      const weather_name = obj.weather_state_name;
      // const weather_image = 'https://www.metaweather.com/static/img/weather/' + obj.weather_state_abbr + '.svg';
      const weather_image = './../../assets/images/icon.png';
      transformedWeather.push({ date, temperature, weather_name, weather_image} as ICityWeather);
    });

    return {
      city: rawData.title,
      country: rawData.parent.title,
      weather: transformedWeather,
    };
  }
}
