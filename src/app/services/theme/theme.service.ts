import {DOCUMENT} from '@angular/common';
import {Injectable, inject, signal} from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({providedIn: 'root'})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'wgenerator-theme';

  public readonly theme = signal<ThemeMode>('light');
  public readonly isDarkMode = signal(false);

  public constructor() {
    this.initializeTheme();
  }

  public toggleTheme(): void {
    this.setTheme(this.isDarkMode() ? 'light' : 'dark');
  }

  public setTheme(theme: ThemeMode): void {
    this.theme.set(theme);
    this.isDarkMode.set(theme === 'dark');
    this.applyTheme(theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  private initializeTheme(): void {
    const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      this.setTheme(storedTheme);
      return;
    }

    const prefersDarkMode = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDarkMode ? 'dark' : 'light');
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.body.classList.toggle('theme-dark', theme === 'dark');
    this.document.documentElement.style.colorScheme = theme;
  }
}
