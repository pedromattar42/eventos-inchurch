import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { EventData } from '../../shared/components/molecules/event-card/event-card.component';

export interface CreateEventRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  hasActiveTickets?: boolean;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const authHeaders = this.authService.getAuthHeaders();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...authHeaders
    });
  }

  // Buscar todos os eventos 
  getEvents(): Observable<EventData[]> {
    return this.http.get<EventData[]>(`${this.API_URL}/events`);
  }

  // Buscar evento por ID 
  getEvent(id: string): Observable<EventData> {
    return this.http.get<EventData>(`${this.API_URL}/events/${id}`);
  }

  // Criar novo evento 
  createEvent(event: CreateEventRequest): Observable<EventData> {
    return this.http.post<EventData>(
      `${this.API_URL}/events`,
      {
        ...event,
        publishedDate: new Date().toISOString()
      },
      { headers: this.getHeaders() }
    );
  }

  // Atualizar evento 
  updateEvent(event: UpdateEventRequest): Observable<EventData> {
    const { id, ...updateData } = event;
    return this.http.put<EventData>(
      `${this.API_URL}/events/${id}`,
      updateData,
      { headers: this.getHeaders() }
    );
  }

  // Deletar evento 
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/events/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
