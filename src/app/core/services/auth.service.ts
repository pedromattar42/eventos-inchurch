import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private authState = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  });

  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);
  isLoading = computed(() => this.authState().isLoading);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authState.set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.authState.update(state => ({ ...state, isLoading: true }));

    // Busca usuário por email no json-server
    return this.http.get<User[]>(`${this.API_URL}/users?email=${credentials.email}`)
      .pipe(
        map(users => {
          if (users.length === 0) {
            throw new Error('Usuário não encontrado');
          }

          const user = users[0];

          if (user.password !== credentials.password) {
            throw new Error('Senha incorreta');
          }

          const token = this.generateToken(user);

          const { password, ...userWithoutPassword } = user;

          return { user: userWithoutPassword as User, token };
        }),
        tap(response => {
          this.setAuth(response.user, response.token);
        }),
        catchError(error => {
          this.authState.update(state => ({ ...state, isLoading: false }));
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private setAuth(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    this.authState.set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.token();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    };

    return btoa(JSON.stringify(payload));
  }

  /**
   * Verifica se o usuário é admin
   */
  isAdmin(): boolean {
    return this.user()?.role === 'admin';
  }
}
