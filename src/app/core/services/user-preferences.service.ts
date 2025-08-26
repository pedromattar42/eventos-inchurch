import { Injectable, signal, computed } from '@angular/core';

export interface ViewPreferences {
  isListView: boolean;
  rows: number;
}

export interface UserPreferences {
  view: ViewPreferences;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly STORAGE_KEY = 'inchurch-user-preferences';
  
  private readonly DEFAULT_PREFERENCES: UserPreferences = {
    view: {
      isListView: false,
      rows: 8
    }
  };

  private _preferences = signal<UserPreferences>(this.DEFAULT_PREFERENCES);

  readonly preferences = computed(() => this._preferences());
  readonly viewPreferences = computed(() => this._preferences().view);
  readonly isListView = computed(() => this._preferences().view.isListView);
  readonly rows = computed(() => this._preferences().view.rows);

  constructor() {
    this.loadPreferences();
  }

  /**
   * Carrega as preferências do localStorage
   */
  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        const preferences: UserPreferences = {
          view: {
            isListView: typeof parsed.view?.isListView === 'boolean'
              ? parsed.view.isListView
              : this.DEFAULT_PREFERENCES.view.isListView,

            rows: 8 
          }
        };

        this._preferences.set(preferences);
      } else {
        this._preferences.set(this.DEFAULT_PREFERENCES);
      }
    } catch (error) {
      this._preferences.set(this.DEFAULT_PREFERENCES);
    }
  }

  /**
   * Salva as preferências no localStorage
   */
  private savePreferences(): void {
    try {
      const preferences = this._preferences();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {}
  }

  /**
   * Atualiza as preferências de visualização
   */
  updateViewPreferences(viewPreferences: Partial<ViewPreferences>): void {
    this._preferences.update(current => ({
      ...current,
      view: {
        ...current.view,
        ...viewPreferences
      }
    }));
    
    this.savePreferences();
  }

  /**
   * Define se a visualização é em lista ou cards
   */
  setListView(isListView: boolean): void {
    this.updateViewPreferences({ isListView });
  }

  /**
   * Define o número de itens por página
   */
  setRowsPerPage(rows: number): void {
    if (rows > 0) {
      this.updateViewPreferences({ rows });
    }
  }

  /**
   * Alterna entre visualização em lista e cards
   */
  toggleListView(): void {
    const currentValue = this.isListView();
    this.setListView(!currentValue);
  }

  /**
   * Reseta as preferências para os valores padrão
   */
  resetPreferences(): void {
    this._preferences.set(this.DEFAULT_PREFERENCES);
    this.savePreferences();
  }

  /**
   * Reseta apenas as preferências de visualização
   */
  resetViewPreferences(): void {
    this.updateViewPreferences(this.DEFAULT_PREFERENCES.view);
  }

  /**
   * Exporta as preferências atuais (útil para backup)
   */
  exportPreferences(): UserPreferences {
    return { ...this._preferences() };
  }
}
