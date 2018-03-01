import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


@Injectable()
export class Data{

	
	public link_local = "http://127.0.0.1/AzisPc/BackEnd/";
	//public link_hosting = "http://azispc.codepanda.web.id/AzisPc/BackEnd/"
 	// public link_hosting = "http://ryanazrian.cf/AzisPc/BackEnd/"
	public link_hosting = "http://azizpc.codepanda.web.id/api/"

	public HAS_LOGGED_IN = 'status_login';
	constructor(public http: Http, public storage: Storage){
		console.log('Hello data provider');
	}

	login(data: any){
		this.storage.set(this.HAS_LOGGED_IN, true);
		this.storage.set('user_data',data);
		//this.storage.set('role', role);
	};

	token(data: string){
		this.storage.set('token', data);
	}
	
	getLat(){
		return this.storage.get('lat').then((value)=>{
			return value;
		})
	}

	getlang(){
		return this.storage.get('lang').then((value)=>{
			return value;
		})
	}

	
	getToken() {
		return this.storage.get('token').then((value) => {
		  return value;
		});
	  }

	logout(){
		this.storage.remove(this.HAS_LOGGED_IN);
		this.storage.remove('user_data');
		// this.storage.remove('role');
	};

	isLogin(){
		return this.storage.get(this.HAS_LOGGED_IN).then((value)=>{
			return value;
		});
	}
	getRole(){
		return this.storage.get('role').then((value)=>{
			return value;
		});
	}

	getData() {
		return this.storage.get('user_data').then((value) => {
		  return value;
		});
	  }

}