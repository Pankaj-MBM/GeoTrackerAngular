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
  
  // Default map center
  center = { lat: 26.9124, lng: 75.7873 }; // Jaipur, India

  // Moving Marker Position (Initially at the first waypoint)
  movingMarker = { lat: 26.9124, lng: 75.7873 };

  // Person PNG Image (Custom Marker)
  personIcon = {
    url: 'https://cdn-icons-png.flaticon.com/512/1365/1365700.png',  // Running person icon
    scaledSize: new google.maps.Size(40, 40) // Adjust marker size
  };

  // List of waypoints (Latitude & Longitude Coordinates)
  waypoints = [
    { lat: 26.9124, lng: 75.7873 }, // Jaipur
    { lat: 27.1767, lng: 78.0081 }, // Agra
    { lat: 28.7041, lng: 77.1025 }  // Delhi
  ];

  // Path for Polyline
  path: any[] = [];

  ngOnInit(): void {
    this.path = [...this.waypoints]; // Draw the full route
    this.animateMovement(); // Start animation
  }

  animateMovement() {
    let index = 0;
    
    const moveToNextWaypoint = () => {
      if (index < this.waypoints.length - 1) {
        this.smoothMove(this.waypoints[index], this.waypoints[index + 1], () => {
          index++;
          moveToNextWaypoint(); // Move to the next point after animation
        });
      }
    };

    moveToNextWaypoint();
  }

  smoothMove(start: any, end: any, callback: () => void) {
    const steps = 500; // Number of animation steps
    let step = 0;

    const animate = () => {
      step++;
      this.movingMarker = {
        lat: start.lat + (end.lat - start.lat) * (step / steps),
        lng: start.lng + (end.lng - start.lng) * (step / steps)
      };

      this.center = this.movingMarker; // Update map center

      if (step < steps) {
        requestAnimationFrame(animate),10; // Smooth animation
      } else {
        callback(); // Move to next waypoint
      }
    };

    animate();
  }
}
