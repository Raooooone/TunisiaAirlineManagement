import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { Observable } from 'rxjs';
import { Passenger } from './interface/passenger';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {
  private apiUrl = 'http://localhost:8080/api/passengers';  // Backend API URL (ensure the port matches your Spring Boot app)

  constructor(private http: HttpClient) {}

  // Get all passengers (API call)
  getPassengers(): Observable<Passenger[]> {
    return this.http.get<Passenger[]>(this.apiUrl);  // GET request to fetch all passengers
  }

  // Add a new passenger (API call)
  addPassenger(passenger: Passenger): Observable<Passenger> {
    return this.http.post<Passenger>(`${this.apiUrl}/add`, passenger);  // POST request to add a new passenger
  }

  // Get passenger by PID (API call)
  getPassengerByPid(pid: string): Observable<Passenger> {
    return this.http.get<Passenger>(`${this.apiUrl}/${pid}`);  // GET request to fetch a passenger by PID
  }

  // Search passengers by search term (PID or full name)
  filterPassengers(searchTerm: string): Observable<Passenger[]> {
    return this.http.get<Passenger[]>(`${this.apiUrl}/search`, {
      params: { term: searchTerm }  // Sending search term as a query parameter
    });
  }

  // Export passengers to PDF
  exportPassengersToPDF(passengers: Passenger[]): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Passenger List", 14, 20);

    const rows = passengers.map(passenger => [
      passenger.pid,
      passenger.fullName,
      passenger.passport,
      passenger.mobileNumber,
      passenger.dob,
      passenger.gender,
      `${passenger.flightNumber} : ${passenger.from} → ${passenger.to}`,
      passenger.flightDate,   // Added flight date column
      passenger.flightTime,   // Added flight time column
      passenger.price         // Added price column
    ]);

    doc.autoTable({
      head: [['PID', 'Full Name', 'Passport', 'Mobile Number', 'DOB', 'Gender', 'Flight Booking', 'Flight Date', 'Flight Time', 'Price']],
      body: rows,
      startY: 30,
    });

    doc.save('passenger-list.pdf');
  }
}
