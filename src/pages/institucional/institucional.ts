import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the InstitucionalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-institucional',
  templateUrl: 'institucional.html',
})
export class InstitucionalPage {

  constructor(public navCtrl: NavController,
              private viewCtrl: ViewController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InstitucionalPage');
  }

}
