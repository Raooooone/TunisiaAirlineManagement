import { Component, OnInit } from '@angular/core';
import { Flight } from '../interface/flight';  // Import the Flight interface
import { FlightService } from '../flight.service';  // Import the FlightService

@Component({
  selector: 'app-flight-management',
  templateUrl: './flight-management.component.html',
  styleUrls: ['./flight-management.component.css']
})
export class FlightManagementComponent implements OnInit {
  flights: Flight[] = [];  // List of flights
  currentFlight: Flight = {  // Holds the flight being added/edited
    flightNumber: '',
    departure: '',
    arrival: '',
    departureDate: '',
    departureTime: '',
    arrivalTime: ''
  };
  isEditing: boolean = false;  // Flag to toggle between adding and editing mode
  isFormVisible: boolean = false;  // Flag to toggle the form visibility
  successMessage: string = '';  // To store success messages
  errorMessage: string = '';  // To store error messages

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();  // Load flights on component initialization
  }

  // Load all flights from the service
  loadFlights(): void {
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.flights = flights;  // Update the flight list with fetched data
        this.successMessage = 'Flights loaded successfully!';
      },
      error: (err) => {
        this.errorMessage = `Failed to load flights: ${err.message}`;
      }
    });
  }

  // Toggle the form visibility for adding/editing a flight
  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();  // Reset form when hidden
    }
  }

  // Reset the flight form
  resetForm(): void {
    this.currentFlight = {
      flightNumber: '',
      departure: '',
      arrival: '',
      departureDate: '',
      departureTime: '',
      arrivalTime: ''
    };
    this.isEditing = false;  // Reset editing mode
  }

  // Open the form for editing a flight
  editFlight(flight: Flight): void {
    this.isEditing = true;
    this.currentFlight = { ...flight };  // Copy the flight details into the form
    this.isFormVisible = true;  // Ensure the form is visible
  }

  // Submit the form to either add or update a flight
  onSubmit(): void {
    if (this.isEditing) {
      this.flightService.updateFlight(this.currentFlight).subscribe({
        next: (updatedFlight) => {
          this.successMessage = 'Flight updated successfully!';
          this.loadFlights();  // Reload the flights after the update
        },
        error: (err) => {
          this.errorMessage = `Failed to update flight: ${err.message}`;
        }
      });
    } else {
      this.flightService.addFlight(this.currentFlight).subscribe({
        next: (newFlight) => {
          this.successMessage = 'Flight added successfully!';
          this.loadFlights();  // Reload the flights after adding
        },
        error: (err) => {
          this.errorMessage = `Failed to add flight: ${err.message}`;
        }
      });
    }
    this.isEditing = false;  // Reset editing mode
    this.isFormVisible = false;  // Hide the form after submission
  }

  // Delete a flight
  deleteFlight(flight: Flight): void {
    this.flightService.deleteFlight(flight.flightNumber).subscribe({
      next: () => {
        this.successMessage = 'Flight deleted successfully!';
        this.loadFlights();  // Reload the flights after deletion
      },
      error: (err) => {
        this.errorMessage = `Failed to delete flight: ${err.message}`;
      }
    });
  }
  confirmDelete(flight: Flight): void {
    const confirmed = confirm(`Are you sure you want to delete flight ${flight.flightNumber}?`);
    if (confirmed) {
      this.deleteFlight(flight);  // Call deleteFlight method if confirmed
    }
}
}
