import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import * as moment from 'moment';
import { DataServiceProvider } from '../../providers/data-service';
import { PatientLocationPage } from '../patient-location/patient-location';

@Component({
  selector: 'page-last-known-well',
  templateUrl: 'last-known-well.html'
})
export class LastKnownWellPage {


myDate=moment().format("HH:mm");
timeForm =new FormGroup({
  time1: new FormControl('',Validators.required),
});
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,public Data: DataServiceProvider) {
   //this.Height=(Data.height)/2;
  
   console.log(this.myDate);
  }
  
  goToLocation(params){
  if (!params) params = {};
    this.navCtrl.push(PatientLocationPage);
}
SubmitTime(params){
  console.warn(this.timeForm.value);
  if (!params) params = {};
    this.navCtrl.push(PatientLocationPage);
    this.Data.time=this.timeForm.value.time1;
    console.log(this.Data.intervalID);
    if(this.Data.LastKnownWellTime!=this.timeForm.value.time1)//only stop if a new a new time is provided 
    {
      clearInterval(this.Data.intervalID);//stops the previous interval from running 
      this.Data.StartTime(this.timeForm.value.time1);// send the new time 
    }
}
  
}