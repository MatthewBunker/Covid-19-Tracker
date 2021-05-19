import {Circle, Popup } from "react-leaflet";
import numeral from "numeral";
import React from "react";

export const sortData = (data) => {
    const sortedData = [...data];

    return sortedData.sort((a,b) => (a.cases > b.cases ? -1 : 1))

    /*sortedData.sort((a, b) => {
        if(a.cases > b.cases) {
            return -1;
        }
        else{
            return 1;
        }
    })
    return sortedData;*/
};

const casesTypeColors = {
    cases: {
        hex: "#66FCF1",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 2000,
    },
};

//draw circles on the map with interactive tooltips
export const showDataOnMap = (data, casesType='cases') => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]} //center of circle
            fillOpacity= {0.4} //slightly transparent
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
        >
        
            <Popup>
                <div>
                    <img src={country.countryInfo.flag} height="50px" width="75px"></img>
                    <h1>{country.country}</h1>
                </div>
                
                <h5>Cases: {country.cases}</h5>
                <h5>Recoveries: {country.recovered}</h5>
                <h5>Deaths: {country.deaths}</h5>
            </Popup>
        </Circle>
    ))
);