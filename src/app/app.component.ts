import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  
  center = { lat: 26.9124, lng: 75.7873 }; // Jaipur
  movingMarker = { lat: 26.9124, lng: 75.7873 };
  
  personIcon = {
    url: 'https://cdn-icons-png.flaticon.com/512/1365/1365700.png',  
    scaledSize: new google.maps.Size(40, 40)
  };

  waypoints = [
    { lat: 26.9124, lng: 75.7873 }, // Jaipur
    { lat: 27.1767, lng: 78.0081 }, // Agra
    { lat: 28.7041, lng: 77.1025 },
    { lat: 30.7333, lng: 76.7794 }, // Chandigarh


  ];
  
  path: any[] = [];
  animationId: any = null;
  isPaused: boolean = false;
  currentSpeed: number = 1; // Normal speed (1X)
  index = 0;
  step = 0;
  totalSteps = 500; // Animation steps

  ngOnInit(): void {
    this.path = [...this.waypoints];
  }

  playAnimation() {
    if (this.index >= this.waypoints.length - 1) {
      this.index = 0; // Reset to the start if at the last point
      this.movingMarker = { ...this.waypoints[0] };
    }
    this.isPaused = false;
    this.animateMovement();
  }

  pauseAnimation() {
    this.isPaused = true;
    cancelAnimationFrame(this.animationId);
  }

  resetAnimation() {
    this.pauseAnimation();
    this.index = 0;
    this.movingMarker = { ...this.waypoints[0] };
    this.center = this.movingMarker;
  }

  changeSpeed(speed: number) {
    this.currentSpeed = speed;
  }

  animateMovement() {
    if (this.index >= this.waypoints.length - 1 || this.isPaused) return;
    
    this.smoothMove(this.waypoints[this.index], this.waypoints[this.index + 1], () => {
      this.index++;
      this.animateMovement();
    });
  }

  smoothMove(start: any, end: any, callback: () => void) {
    this.step = 0;

    const animate = () => {
      if (this.isPaused || this.step >= this.totalSteps) {
        callback();
        return;
      }
      
      this.step += this.currentSpeed;
      this.movingMarker = {
        lat: start.lat + (end.lat - start.lat) * (this.step / this.totalSteps),
        lng: start.lng + (end.lng - start.lng) * (this.step / this.totalSteps)
      };

      this.center = this.movingMarker;
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }
}
