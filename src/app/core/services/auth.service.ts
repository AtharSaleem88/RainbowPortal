import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Store } from '@ngrx/store'

import { CookieService } from 'ngx-cookie-service'
import type { User, UserRole } from '@/app/helper/fake-backend'
import { loginSuccess } from '@store/authentication/authentication.actions'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null
  public currentUser$: BehaviorSubject<User | null>

  public readonly authSessionKey = '_RAINBOW_AUTH_SESSION_KEY_'
  public readonly authUserKey = '_RAINBOW_AUTH_USER_'
  private cookieService = inject(CookieService)
  private router = inject(Router)
  private store = inject(Store)

  constructor(private http: HttpClient) {
    const cached = localStorage.getItem(this.authUserKey)
    if (cached) {
      try {
        this.user = JSON.parse(cached)
      } catch {
        this.user = null
      }
    }
    // Fallback if session exists but user object was not loaded
    if (!this.user && this.session) {
      this.user = {
        id: 1,
        username: 'RainbowAdmin',
        name: 'Rainbow Super Admin',
        email: 'admin@rainbow.com',
        role: 'Admin',
        title: 'Enterprise Super Administrator',
        avatar: 'assets/images/users/avatar-1.jpg',
        branchCode: 'all',
        branchName: 'All Branches (Enterprise)',
      }
    }
    this.currentUser$ = new BehaviorSubject<User | null>(this.user)
  }

  login(email: string, password: string) {
    return this.http.post<User>(`/api/login`, { email, password }).pipe(
      map((user) => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          this.user = user
          localStorage.setItem(this.authUserKey, JSON.stringify(user))
          // store user details and jwt in session
          this.saveSession(user.token)
          this.currentUser$.next(this.user)
        }
        return user
      })
    )
  }

  /**
   * Quick role and branch persona switcher for instant testing and demonstration
   */
  switchUserRole(role: UserRole, branchCode: string = 'VAL-01'): void {
    const token = this.session || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...'
    let newUser: User

    if (role === 'Branch Manager') {
      newUser = {
        id: 2,
        username: 'ManagerValencia',
        name: 'Muhammad Salman',
        firstName: 'Muhammad',
        lastName: 'Salman',
        email: 'manager.valencia@rainbow.com',
        role: 'Branch Manager',
        title: 'Valencia Branch Operations Manager',
        avatar: 'assets/images/users/avatar-4.jpg',
        branchCode: 'VAL-01',
        branchName: 'Rainbow Cash & Carry - Valencia',
        token,
      }
    } else if (role === 'Moderator') {
      newUser = {
        id: 3,
        username: 'ModeratorValencia',
        name: 'Imran Tariq',
        firstName: 'Imran',
        lastName: 'Tariq',
        email: 'moderator.valencia@rainbow.com',
        role: 'Moderator',
        title: 'Valencia Store Orders Moderator',
        avatar: 'assets/images/users/avatar-2.jpg',
        branchCode: 'VAL-01',
        branchName: 'Rainbow Cash & Carry - Valencia',
        token,
      }
    } else {
      newUser = {
        id: 1,
        username: 'RainbowAdmin',
        name: 'Rainbow Super Admin',
        firstName: 'Rainbow Super',
        lastName: 'Admin',
        email: 'admin@rainbow.com',
        role: 'Admin',
        title: 'Enterprise Super Administrator',
        avatar: 'assets/images/users/avatar-1.jpg',
        branchCode: 'all',
        branchName: 'All Branches (Enterprise)',
        token,
      }
    }

    this.user = newUser
    localStorage.setItem(this.authUserKey, JSON.stringify(newUser))
    this.saveSession(newUser.token!)
    this.currentUser$.next(this.user)
    this.store.dispatch(loginSuccess({ user: this.user as any }))

    // If moderator, ensure they are routed to orders module
    if (role === 'Moderator') {
      const currentUrl = this.router.url
      if (!currentUrl.includes('/orders')) {
        this.router.navigate(['/orders/list'])
      }
    }
  }

  logout(): void {
    // remove user from cookie and storage to log user out
    this.removeSession()
    localStorage.removeItem(this.authUserKey)
    this.user = null
    this.currentUser$.next(null)
  }

  get session(): string {
    return this.cookieService.get(this.authSessionKey)
  }

  saveSession(token: string): void {
    this.cookieService.set(this.authSessionKey, token)
  }

  removeSession(): void {
    this.cookieService.delete(this.authSessionKey)
  }
}
