import React, {useState, useEffect} from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from './InfoBox';
import map from "./Map";
import Table from "./Table";
import { sortData, showDataOnMap } from "./util";
import LineGraph from "./LineGraph";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import './App.css';

{/*Curly brackets allow you to use javascript in html */}

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide'); //default Worldwide for dropdown
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);

  //When app initially opens
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  //STATE = how to write a variable in react

  //USEEFFECT = runs a piece of code based on given condition
  //once App() function loads run this function once, and then whenever countries
  //variable changes run it again
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, //United Kingdom, United States
            value: country.countryInfo.iso2 //Uk, USA, FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setmapCountries(data);
          
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode == 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch (url).then(response => response.json()).then(data => {
      setCountry(countryCode);

      //All of the data
      setCountryInfo(data);

      if(countryCode == 'worldwide'){
        setMapCenter({lat: 34.80746, lng: -40.4796});
        setMapZoom(3);
      }
      else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      }

      
    });
  };


  //mostly material-UI and HTML
  return (
    <div className="app">
      <div className="app_left">
          {/*Header */}
        {/*Title + select input dropdown field*/}
        <div className="app_header">
          <div>
            <h1 className="title">COVID-19 TRACKER</h1>
            <h5 className="author">By: Matthew Bunker</h5>
          </div>
          <FormControl className="app_dropdown">
            <Select variant='outlined' onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide"><strong>Worldwide</strong></MenuItem>
              {countries.map(country => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

              {/*<MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="worldwide">Option 2</MenuItem>
              <MenuItem value="worldwide">Option 3</MenuItem>
              <MenuItem value="worldwide">Option 4</MenuItem>*/}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          {/* Infobox Cases*/}
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>

          {/* Infobox Recoveries */}
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>

          {/* Infobox Deaths */}
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
              
        </div>

        {/* Map */}
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom}></Map>
      </div>

      <Card className="app_right">
        <CardContent>
          <div className="table">
            {/*table*/}
            <h3 className="table_title">Live Cases by Country</h3>
            <Table countries={tableData}></Table>
          </div>

          <div>
            {/*Graph*/}
            <h3 className="graph_title">Worldwide new cases</h3>
            <LineGraph className="graph"></LineGraph>
          </div>
        </CardContent>
      </Card>

      
    </div>

    
      
  );
}

export default App;
