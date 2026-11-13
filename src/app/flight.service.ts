import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Flight } from './interface/flight';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly API_URL = 'http://localhost:8080/api/flights';  // Update this with your backend API URL

  private flightDetailsSubject = new BehaviorSubject<Flight | null>(null);
  flightDetails$ = this.flightDetailsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all flights from the API
  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.API_URL).pipe(
      catchError(this.handleError)  // Handle errors using the custom function
    );
  }

  // Get a single flight by flight number from the API
  getFlightByNumber(flightNumber: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.API_URL}/${flightNumber}`).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new flight via the API
  addFlight(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(this.API_URL, flight).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing flight via the API
  updateFlight(flight: Flight): Observable<Flight> {
    const url = `http://localhost:8080/api/flights/${flight.flightNumber}`; // Include the flight number in the URL
    return this.http.put<Flight>(url, flight);  // Send the flight object in the body
  }
  

  // Delete a flight via the API
  deleteFlight(flightNumber: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${flightNumber}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors and return a user-friendly message
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    // Optionally, log the error or send it to a server-side logging system
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));  // Return an observable with a user-friendly error message
  }
}
