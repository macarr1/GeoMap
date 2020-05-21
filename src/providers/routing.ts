import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DataServiceProvider } from '../providers/data-service';
import { MapsAPILoader } from '@agm/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "angularfire2/firestore"
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; 
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Rx';
import { isNgTemplate, identifierModuleUrl } from '@angular/compiler';
import { WeatherService } from '../pages/patient-location/weather';
import { getValueFromFormat } from 'ionic-angular/umd/util/datetime-util';
import { p } from '@angular/core/src/render3';
import { repeat } from 'rxjs-compat/operator/repeat';
import { resolve } from 'dns';
import { resolveReflectiveProviders } from '@angular/core/src/di/reflective_provider';


/*

  Generated class for the RoutingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RoutingProvider {
OriginLat: any=this.Data.lat;
OriginLng:any=this.Data.lng;// probably need to change was not working 
googleResults:any;

ImgRoutes: any;
tPARoutes: any;
EVTRoutes: any;
closestFlightOpt: any=[];
Database: any;
LandingSites:any;

loc:any;

  constructor(public http: HttpClient,public Data: DataServiceProvider,public DataBase: AngularFireDatabase,
    private afs: AngularFirestore,
    private weatherService: WeatherService) {
      this.Database = firebase.firestore();
  }

    async nearestLocations(){
    var lng=this.Data.lng;
    var lat=this.Data.lat;
     var distances= this.Database.collection("/Landing Sites/")
      //ref.orderBy("lat")
      //.startAt(this.Data.lat+0.5)
      //.endAt(this.Data.lat-0.5)
      .get()
      .then((querySnapshot) => {
        var total=[]
        querySnapshot.forEach(function(doc) {
          
         
            var obj = JSON.parse(JSON.stringify(doc.data()));
            total.push(obj);
          
        });
        this.LandingSites=total;
        return total;
        
    });
    return distances;
  }
   async getCloseLoc(lat, lng)// gets all close locations to the site for the best airport and helipad options 
    {
      var all= this.LandingSites;
     // console.log(all.length);
      var heli=[];
      var plane=[];
      var repeat=1;
      var radius=0.5;
      var closestFlightOpt=[];
      while(repeat==1)
      {
        for(var i=0;i<all.length;i++)
        {
          if(Math.abs(Math.abs(all[i].lat)-Math.abs(lat))<radius&&Math.abs(Math.abs(all[i].lng)-Math.abs(lng))<radius)
          {
            //console.log("found");
            if(all[i].type=="Airport")
            {
             // console.log("Plane You NUMPTY!");
              plane.push(all[i]);
            }
            else if(all[i].type=="Helipad")
            {
              heli.push(all[i]);
            }
          }
        }
        if(heli.length==0||plane.length==0)
        {
          radius=radius+0.2;
         // console.log("Need to repeat");
        }
        else
        {
         // console.log("Found an Airport and Helipad");
          repeat=0;
        }
      }
      heli.sort((a,b)=>(Math.abs(Math.abs(a.lat)-Math.abs(lat))+Math.abs(Math.abs(a.lng)-Math.abs(lng)))-(Math.abs(Math.abs(b.lat)-Math.abs(lat))+Math.abs(Math.abs(b.lng)-Math.abs(lng))));
      plane.sort((a,b)=>(Math.abs(Math.abs(a.lat)-Math.abs(lat))+Math.abs(Math.abs(a.lng)-Math.abs(lng)))-(Math.abs(Math.abs(b.lat)-Math.abs(lat))+Math.abs(Math.abs(b.lng)-Math.abs(lng))));
      //console.log(plane);
      //console.log(heli);
      closestFlightOpt[0]=heli[0];
      closestFlightOpt[1]=plane[0];
      //onsole.log(closestFlightOpt);
      return closestFlightOpt;
    }
    




origin_weather_multiplier: number;
origin_area_multiplier: number;
origin_total_multiplier: any;

// multipliers for weather and area
async getOriginWeatherMultiplier(){
await this.Database.collection("/Multipliers/").doc(JSON.stringify(this.Data.origin_id))
  .get()
  .then((querySnapshot) => {
      this.origin_weather_multiplier = querySnapshot.data().multi;
      return this.origin_weather_multiplier;
  });

}

async getOriginAreaMultiplier(){
await this.Database.collection("/Multipliers Area/").doc(this.Data.origin_area)
  .get()
  .then((querySnapshot) => {
      this.origin_area_multiplier = querySnapshot.data().multi;
      return this.origin_area_multiplier;
  });

}

async totalOriginMultiplier(){
  await this.getOriginAreaMultiplier();
  await this.getOriginWeatherMultiplier();
  this.origin_total_multiplier = (this.origin_weather_multiplier + this.origin_area_multiplier)/2;
  return this.origin_total_multiplier;

}

heli: any;
plane: any;
flight_weather_origin: any;
flight_weather_destination: any;

async getFlightSpeeds(){
  await this.Database.collection("/Air_Speed/").doc("heli")
  .get()
  .then((querySnapshot) => {
      this.heli = querySnapshot.data().speed;
      return this.heli;
  });

  await this.Database.collection("/Air_Speed/").doc("plane")
  .get()
  .then((querySnapshot) => {
      this.plane = querySnapshot.data().speed;
      return this.plane;
  });

  await this.Database.collection("/Multipliers/").doc(JSON.stringify(this.Data.origin_id))
  .get()
  .then((querySnapshot) => {
      this.flight_weather_origin = querySnapshot.data().multi_air;
      return this.flight_weather_origin;
  });



  let speed_vals = {
    heli_speed: this.heli,
    plane_speed: this.plane,
    origin_weather: this.flight_weather_origin
  }
  return {speed_vals}
}

addRoutes(drive, air)
{
 
  for(var i=0;i<air.length;i++)
  {
   
      if(air[i].Dist!=0&&air[i].name!=this.Data.StartLoc.name)
      {
        drive.push(air[i]);
      }
      
      
    
  }
  
  var i = 0;
  while(i == 0){
    if(drive[i]!=undefined){

      if(drive[i].Dist==0)
    {
      drive.splice(i, 1);
  }
  else{
    break;
  }
}
    else{
      break;
    }
  }
  

return drive;
  //console.log(drive);
}



async getRoutes(param){//Get the routes based off the parameter specified to search by 
  await this.getOriginAreaMultiplier();
  await this.getOriginWeatherMultiplier();
  
  var Routes=[];
  
var serv;
  
  
  var weatherService = this.weatherService;
  var Data = this.Data;
  var w;

  

var ret= await this.Database.collection("/Health Centers/").where(param,"==",true)
.get()
.then(async function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data().name);
      var distobj={
        name:doc.data().name,
        address:doc.data().address,
        city:doc.data().city,
        lat:doc.data().lat,
        lng:doc.data().lng,
        area:doc.data().area,
        Driving:true,
        TimeWithMult: 0,
        TimeWithMultChar: "",
        Timechar: "",
        Timeval: 0,
        DistChar: "",
        Dist: 0,
        weather_code: ""
      }
     // console.log(distobj);
      Routes.push(distobj);

      weatherService.getWeatherFromApi(distobj.lat, distobj.lng).subscribe(weather => {  
        w = weather;
        let id = w.weather[0].id;
        distobj.weather_code = id;
        let description = w.weather[0].description;
        let icon = w.weather[0].icon;
        let tempreal = w.main.temp - 273.15;
        let tempfeel = w.main.temp - 273.15;
        // gets description of weather
        let destination_weatherdata = [id, description, icon, tempreal, tempfeel];
      }); 
  });
  
  return Routes;
});
var destinations=[];
for(var i=0;i<Routes.length;i++)
{
let coords= new google.maps.LatLng(Routes[i].lat,Routes[i].lng);
destinations[i]=coords;
}
var m=ret;//////////////////////////////////////////////////////////////////////////MITY CHANGES ARE HERE 
//console.log(m);
//console.log(ret);
//console.log(destinations);
ret=await this.distMat(destinations,ret);
//console.log(ret);
return ret;
}

destination_flight_weather_array;

async distMat(destinations,Routes){
  
  var mult=await this.totalOriginMultiplier();
  var Database = this.Database;
  var destination_weather_multiplier;
  var destination_area_multiplier;
  var destination_total_multiplier;

  var flight_dest_weather;
  var getflight = [];

  for(var m=0;m<Routes.length;m++)
  {

      await flightWeatherDestination(Routes[m].weather_code).then(data => {
         flight_destination_weather = data;
      });
      getflight.push(flight_destination_weather);

  }
       // get multiplier for weather of flight destination

       async function flightWeatherDestination(id){
        let val = await Database.collection("/Multipliers/").doc(JSON.stringify(id))
        .get()
        .then((querySnapshot) => {
            flight_dest_weather = querySnapshot.data().multi_air;
            return flight_dest_weather;
          });
          return val;
       }
      // console.log(getflight)
       this.destination_flight_weather_array = getflight;




  var origin=new google.maps.LatLng(this.Data.lat,this.Data.lng);
  var service= new google.maps.DistanceMatrixService();
  const {response,status}=await new Promise(resolve => 
    service.getDistanceMatrix(
   {
     origins: [origin],
     destinations: destinations,
     travelMode: google.maps.TravelMode.DRIVING,
   },(response, status) => resolve({response,status}))
  );
  const resp=await handleMapResponse(response,status);
   var final_multiplier;
   var flight_destination_weather;
    async function handleMapResponse(response,status){
    
     for(var m=0;m<Routes.length;m++)
     {
      if(response.rows[0].elements[m].status != "ZERO_RESULTS")////////////////////////////////////////////////////MITY CHANGES HERE
      {
        Routes[m].Timechar=response.rows[0].elements[m].duration.text;
        Routes[m].TimeWithMultChar=response.rows[0].elements[m].duration.text;
        Routes[m].Timeval=response.rows[0].elements[m].duration.value;
        Routes[m].DistChar=response.rows[0].elements[m].distance.text;
        Routes[m].Dist=response.rows[0].elements[m].distance.value;
        await initiateMultipliers(Routes[m].weather_code, Routes[m].area).then(data => {
          final_multiplier = data;
        });
        Routes[m].TimeWithMult=Routes[m].Timeval*final_multiplier;
        Routes[m].CompTime=Routes[m].TimeWithMult/3600;////////////////////////////////////////////////////
       // console.log(Routes[m])
        //console.log(mult)
       // console.log(m)
       // console.log(final_multiplier)
    }
      }
         

     // get multiplier for weather and area of land ambulance destination

     var weather_multiplier;
     var area_multiplier;
     var destination_total;
     var final;
     async function initiateMultipliers(id, area){
       await getDestinationWeatherMultiplier(id).then(data => {
         weather_multiplier = data;
       })
       await getDestinationAreaMultiplier(area).then(data => {
         area_multiplier = data;
       })
 
       destination_total = (weather_multiplier + area_multiplier) / 2;
       final = (mult + destination_total) / 2;
       return final;
     }
 
     async function getDestinationWeatherMultiplier(id){
      let val = await Database.collection("/Multipliers/").doc(JSON.stringify(id))
         .get()
         .then((querySnapshot) => {
             destination_weather_multiplier = querySnapshot.data().multi;
             return destination_weather_multiplier;
           });
           return val;
     }
 
     async function getDestinationAreaMultiplier(area){
       let val = await Database.collection("/Multipliers Area/").doc(area)
           .get()
           .then((querySnapshot) => {
               destination_area_multiplier = querySnapshot.data().multi;
               return destination_area_multiplier;
             });
             return val;
     }
 
     Routes = await convertTime(Routes);
       await sortRoutes();
     async function sortRoutes(){
      Routes.sort((a,b)=>a.TimeWithMult-b.TimeWithMult);
    //  console.log(Routes.sort((a,b)=>a.TimeWithMult-b.TimeWithMult))
     // console.log(Routes.sort((a,b)=>a.Timeval-b.Timeval))
      return Routes;
    }
    return Routes;
  }
    
    //console.log(resp)
    return resp;
  }

  masterSort(ArraytoSort)
  {
    ArraytoSort.sort((a,b)=>a.CompTime-b.CompTime);//////////////////////////////////////////////////////////
    return ArraytoSort;
  }


 async SetColour(param){
   
 // console.log(this.Data.SinceTimeForm);
  for(var i=0; i<param.length;i++)
  {
    var RouteTime=param[i].CompTime;
    var timePassed=this.Data.SinceTimeForm;
   // console.log(RouteTime);
   // console.log(timePassed);
    if((RouteTime+timePassed)<4.5)
    {
      param[i].colour="#90EE90";
    }
    else if((RouteTime+timePassed)>=4.5&&(RouteTime+timePassed)<6)
    {
      param[i].colour="#FFFF99";
    }
    else if((RouteTime+timePassed)>=6)
    {
      param[i].colour="#F7CFCE";
    }
    
  }
   return param;
  }

async getFlights(endpoints)
{
 // console.log(this.Data.lat);
 // console.log(this.Data.lng);
 var loc = await this.getCloseLoc(this.Data.lat,this.Data.lng);
 this.loc=loc;
var dest= new Array(endpoints.length);
//console.log(endpoints.length);
for(var o=0;o<endpoints.length;o++)
{
  var closesites={
    CloseHospital: endpoints[o].name,
    CloseCity:endpoints[o].city,
    Sites: await this.getCloseLoc(endpoints[o].lat,endpoints[o].lng)
  }
  //console.log(closesites);
  dest[o]=(closesites);
}
//console.log(loc);
//console.log(dest);

var distances= new Array(loc.length);
for(var j=0;j<loc.length;j++)
{
  distances[j]=new Array(dest.length);
}
//console.log(dest);
console.log(loc);


var origins=[];
var destinations=[];
var RouteToHeli=true;
var RouteToPlane=true;
origins.push(new google.maps.LatLng(this.Data.lat,this.Data.lng));
for(var r=0;r<this.loc.length;r++)
{
destinations.push(new google.maps.LatLng(this.loc[r].lat,this.loc[r].lng));
}

var service= new google.maps.DistanceMatrixService();
const {response,status}=await new Promise(resolve => 
  service.getDistanceMatrix(
 {
   origins: origins,
   destinations: destinations,
   travelMode: google.maps.TravelMode.DRIVING,
 },(response, status) => resolve({response,status}))
);
const resp=await handleMapResponse(response,status);
 
  async function handleMapResponse(response,status){
  return response;
   
  }
console.log(resp);
  console.log(response.rows[0].elements[0].status)
  var HeliDriveTime=0;
  var PlaneDriveTime=0;
  var HeliDriveDistance=0;
  var PlaneDriveDistance=0;
  if(response.rows[0].elements[0].status="OK"&&response.rows[0].elements[0].duration!=undefined)
  {
        HeliDriveTime=response.rows[0].elements[0].duration.value/3600;
        HeliDriveDistance=response.rows[0].elements[0].distance.value/1000;
  }
  else if(response.rows[0].elements[0].status="ZERO_RESULTS"||response.rows[0].elements[0].duration==undefined)
  {
    RouteToHeli=false;
  }
  if(response.rows[0].elements[1].status="OK"&&response.rows[0].elements[1].duration!=undefined)
  {
        PlaneDriveTime=response.rows[0].elements[1].duration.value/3600;
        PlaneDriveDistance=response.rows[0].elements[1].distance.value/1000;
  }
  else if(response.rows[0].elements[1].status="ZERO_RESULTS"||response.rows[0].elements[1].duration==undefined)
  {
    RouteToPlane=false;
  }  
  
var flight_time;
await this.getFlightSpeeds().then(data => {
  flight_time = data;
});
//console.log(flight_time)

var heli_speed: number = flight_time.speed_vals.heli_speed;
var plane_speed: number = flight_time.speed_vals.plane_speed;
var flight_o_weather: number = flight_time.speed_vals.origin_weather;
var distances=[];
if(RouteToHeli==true)
{
  for(var m=0;m<dest.length;m++)
{ 
var heliDist= getDistance(loc[0].lat,loc[0].lng,dest[m].Sites[0].lat,dest[m].Sites[0].lng)+HeliDriveDistance;
var time=(heliDist / heli_speed) * flight_o_weather * this.destination_flight_weather_array[m]+HeliDriveTime
  var heliopt={
    origin: loc[0],
    desti:dest[m].Sites[0],
    Dist:heliDist,
    DistChar: convertDist(heliDist),
    name: dest[m].CloseHospital,
    city: dest[m].CloseCity,
    closestSite: endpoints[m],
    Helipad: true,
    Airport: false,
    TimeWithMult: time,
    TimeWithMultChar: convertTimePlanes(time),
    CompTime: time/////////////////////////////////////////////////////////////////////////////////////////////////////
    
  }
 distances.push(heliopt);
  }
}


if(RouteToPlane==true)
{
for(var m=0;m<dest.length;m++)
{ var distplane= getDistance(loc[1].lat,loc[1].lng,dest[m].Sites[1].lat,dest[m].Sites[1].lng)+PlaneDriveDistance;
  var timeplane=(distplane / heli_speed) * flight_o_weather * this.destination_flight_weather_array[m]+PlaneDriveTime;

  var flightopt={
    origin: loc[1],
    desti:dest[m].Sites[1],
    Dist: distplane,
    DistChar: convertDist(distplane),
    name: dest[m].CloseHospital,
    city: dest[m].CloseCity,
    closestSite: endpoints[m],
    Helipad: false,
    Airport: true,
    TimeWithMult: timeplane,
    TimeWithMultChar: convertTimePlanes(timeplane),
    CompTime: timeplane/////////////////////////////////////////////////////////////////////////////////////////////////////
    
  }
  distances.push(flightopt);
}
 // origins.push(new google.maps.LatLng(dest[m].Sites[i].lat,dest[m].Sites[i].lng));
  
}
console.log(distances);
 

  return distances;
}



}
function removeHeli(distances){
  var i = 0;
  while(i == 0){
    if (distances[i].Helipad == true) {
      distances.splice(i, 1);
    }
    else{
      break;
    }
  }
  return distances;
}
function convertDist(dist)
{
  var distString=(Math.ceil(dist)).toString()+" km";
  return distString;
}


async function convertTime(obj: any)
{
for(var l=0;l<obj.length;l++)
{
  var newtimeChar=obj[l].TimeWithMult;
  newtimeChar=newtimeChar/3600;
  let start=Math.abs(newtimeChar);
  start=Math.floor(start);
  let end=Math.abs(newtimeChar)-start;
  end=Math.ceil(end*60);
  if(end==60)
  {
    end=0;
    start++;
  }
 if (start != 0 && end != 0){
    newtimeChar=start.toString()+" hours "+end.toString()+" mins";
  }
  else if (end == 0){
    newtimeChar=start.toString()+" hours";
  }
  else{
    newtimeChar=end.toString()+" mins";
  }
  obj[l].TimeWithMultChar=newtimeChar;

}
return obj;
}

function convertTimePlanes(obj: any)
{

  var newtimeChar=obj;
  let start=Math.abs(newtimeChar);
  start=Math.floor(start);
  let end=Math.abs(newtimeChar)-start;
  end=Math.ceil(end*60);
  if(end==60)
  {
    end=0;
    start++;
  }

  if (start != 0 && end != 0){
    newtimeChar=start.toString()+" hours "+end.toString()+" mins";
  }
  else if (end == 0){
    newtimeChar=start.toString()+" hours";
  }
  else{
    newtimeChar=end.toString()+" mins";
  }


return newtimeChar;
}


function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

