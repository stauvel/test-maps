import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

const YOUR_API_KEY: string = '';
declare var google;

@Component({
  selector: 'app-maps-wrapper',
  templateUrl: './maps-wrapper.component.html',
  styleUrls: ['./maps-wrapper.component.css']
})
export class MapsWrapperComponent implements OnInit {

  private _scriptLoadingPromise: any;
  private map: any;
  private geocoder: any;

  address: string;

  @ViewChild('map') mapRef: ElementRef;

  constructor() { }

  ngOnInit() {
    let options = {
      center: {lat: 27.6648274, lng: -81.515},
      scrollwheel: false,
      zoom: 8
    };
    this.initMap(options);

  }

  initMap(options: any) {
    return this.load().then(() =>
      {
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
          this.geocoder = new google.maps.Geocoder();
      }
    );
  }

  addMarker(lat: number, lng: number, title: string = 'test'){
    return new google.maps.Marker({
      map: this.map,
      position: {lat: lat, lng: lng},
      title: title
    });
  }

  geocodeAddress(address: string, cb: ((lat: number, lng: number) => any)): any {
    console.log("address : ", address);
    this.geocoder.geocode({'address': address}, (result) => {
      let location = result[0].geometry.location;
      cb(location.lat(), location.lng());
    });
  }

  i = 1;

  testAddress() {
    let position = this.geocodeAddress(this.address, (lat, lng) =>{
      console.log("OK", lat, lng);
      this.map.setCenter({lat: lat, lng: lng});
      this.addMarker(lat, lng, `test_${this.i++}`)
    });
  }

  load(): any {
    if (this._scriptLoadingPromise) {
      return this._scriptLoadingPromise;
    }

    const script = window.document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    const callbackName: string = `angular2GoogleMapsLazyMapsAPILoader`;
    script.src = this._getScriptSrc(callbackName);

    this._scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (<any>window)[callbackName] = () => { resolve(); };

      script.onerror = (error: Event) => { reject(error); };
    });

    window.document.body.appendChild(script);
    return this._scriptLoadingPromise;
  }

  private _getScriptSrc(callbackName) {
    return `https://maps.googleapis.com/maps/api/js?key=${YOUR_API_KEY}&callback=${callbackName}`;
  }

}
