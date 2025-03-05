import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  
  
  center = { lat: 26.9124, lng: 75.7873 }; 
  movingMarker = { lat: 26.9124, lng: 75.7873 };

  personIcon = {
    url: 'https://cdn-icons-png.flaticon.com/512/1365/1365700.png',
    scaledSize: new google.maps.Size(40, 40)
  };

  waypointsByDate: any = {
    '2024-02-26': [
      { lat: 26.9124, lng: 75.7873 }, 
      { lat: 27.1767, lng: 78.0081 }, 
      { lat: 28.7041, lng: 77.1025 }, 
      { lat: 29.0588, lng: 76.0856 }, 
      { lat: 30.7333, lng: 76.7794 }, 
    ],
    '2024-02-27': [
      { lat: 30.7333, lng: 76.7794 }, 
      { lat: 31.5204, lng: 75.9800 }, 
      { lat: 32.7266, lng: 74.8570 }, 
      { lat: 34.0837, lng: 74.7973 }, 
      { lat: 35.9553, lng: 74.0890 }, 
    ],
    '2024-02-28': [
      { lat: 22.5726, lng: 88.3639 }, 
      { lat: 23.2599, lng: 77.4126 }, 
      { lat: 25.3176, lng: 82.9739 }, 
      { lat: 26.8467, lng: 80.9462 }, 
      { lat: 28.7041, lng: 77.1025 }, 
    ],
    '2024-02-29': [
      { lat: 19.0760, lng: 72.8777 }, 
      { lat: 21.1702, lng: 72.8311 }, 
      { lat: 23.0225, lng: 72.5714 }, 
      { lat: 24.5854, lng: 73.7125 },
      { lat: 25.4358, lng: 81.8463 }, 
    ],
    '2024-03-01': [
      { lat: 13.0827, lng: 80.2707 }, 
      { lat: 12.9716, lng: 77.5946 }, 
      { lat: 15.2993, lng: 74.1240 }, 
      { lat: 17.3850, lng: 78.4867 }, 
      { lat: 19.0760, lng: 72.8777 }, 
    ],
    '2024-03-02': [
      { lat: 10.8505, lng: 76.2711 },
      { lat: 9.9312, lng: 76.2673 }, 
      { lat: 8.5241, lng: 76.9366 }, 
      { lat: 12.2958, lng: 76.6394 }, 
      { lat: 11.0168, lng: 76.9558 }, 
    ],
    '2024-03-03': [
      { lat: 26.1445, lng: 91.7362 }, 
      { lat: 27.3314, lng: 88.6138 }, 
      { lat: 25.5788, lng: 91.8933 }, 
      { lat: 24.8170, lng: 93.9368 }, 
      { lat: 23.7271, lng: 92.7176 }, 
    ],
    '2024-03-04': [
      { lat: 21.1458, lng: 79.0882 }, 
      { lat: 22.7196, lng: 75.8577 }, 
      { lat: 23.1765, lng: 79.9348 }, 
      { lat: 24.4525, lng: 77.6750 }, 
      { lat: 25.4358, lng: 81.8463 }, 
    ],
    '2024-03-05': [
      { lat: 11.4102, lng: 76.6950 }, 
      { lat: 12.3123, lng: 76.6523 }, 
      { lat: 13.3409, lng: 74.7421 }, 
      { lat: 14.1670, lng: 75.0403 }, 
      { lat: 15.8507, lng: 74.4987 }, 
    ],
    '2024-03-06': [
      { lat: 22.3072, lng: 73.1812 }, 
      { lat: 23.2419, lng: 69.6704 }, 
      { lat: 24.5854, lng: 73.7125 }, 
      { lat: 25.2138, lng: 75.8648 }, 
      { lat: 26.4499, lng: 74.6399 }, 
    ],
  };
  
  selectedDate: string = '';
  path: any[] = [];
  isPaused: boolean = false;
  currentSpeed: number = 1;
  index = 0;
  step = 0;
  totalSteps = 500;
  animationId: any = null;

  ngOnInit(): void {
    this.selectedDate = '2024-02-27'; 
    this.updatePath();
  }

  updatePath() {
    this.index = 0;
    this.step = 0;
    this.path = this.waypointsByDate[this.selectedDate] || [];
    if (this.path.length > 0) {
      this.movingMarker = { ...this.path[0] };
      this.center = this.movingMarker;
    }
  }

  playAnimation() {
    if (this.index >= this.path.length - 1) {
      this.index = 0;
      this.movingMarker = { ...this.path[0] };
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
    this.movingMarker = { ...this.path[0] };
    this.center = this.movingMarker;
  }

  changeSpeed(speed: number) {
    this.currentSpeed = speed;
  }

  animateMovement() {
    if (this.index >= this.path.length - 1 || this.isPaused) return;

    this.smoothMove(this.path[this.index], this.path[this.index + 1], () => {
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
  onSliderChange(event: any) {
    this.pauseAnimation(); // Pause animation when slider is used
    this.index = +event.target.value; // Get slider value
    if (this.path.length > 0) {
      this.movingMarker = { ...this.path[this.index] }; // Update marker position
      this.center = this.movingMarker; // Center map on marker
    }
  }
}
