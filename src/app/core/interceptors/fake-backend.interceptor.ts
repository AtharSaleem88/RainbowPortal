import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators'

export type UserRole = 'Admin' | 'Branch Manager' | 'Moderator' | 'Dispatcher'

export type User = {
  id?: string | number
  username?: string
  password?: string
  firstName?: string
  lastName?: string
  name?: string
  token?: string
  email?: string
  avatar?: string
  location?: string
  title?: string
  role?: UserRole
  branchCode?: string
  branchName?: string
}

type MyRequestBody = {
  // Define the structure of your request body
  username: string
  name: string
  password: string
  email: string
}

let Token: string =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZWNoemFhIiwiYXVkIjoiaHR0cHM6Ly90ZWNoemFhLmdldGFwcHVpLmNvbS8iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVjaHphYSIsIkVtYWlsIjoidGVjaHphYXN0dWRpb0BnbWFpbC5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJUZXN0VG9rZW4ifQ.ud4LnFZ-mqhHEYiPf2wCLM7KvLGoAxhXTBSymRIZEFLleFkO119AXd8p3OfPCpdUWSyeZl8-pZyElANc_KHj5w'
/**
 * @returns registered user list
 */
function getUsers(): User[] {
  let users: User[] = JSON.parse(sessionStorage.getItem('users')!) || [
    {
      id: 1,
      username: 'RainbowAdmin',
      email: 'admin@rainbow.com',
      password: '123456',
      firstName: 'Rainbow Super',
      lastName: 'Admin',
      name: 'Rainbow Super Admin',
      avatar: 'assets/images/users/avatar-1.jpg',
      location: 'Lahore, Pakistan',
      title: 'Enterprise Super Administrator',
      role: 'Admin',
      branchCode: 'all',
      branchName: 'All Branches (Enterprise)',
      token: Token,
    },
    {
      id: 2,
      username: 'ManagerValencia',
      email: 'manager.valencia@rainbow.com',
      password: '123456',
      firstName: 'Muhammad',
      lastName: 'Salman',
      name: 'Muhammad Salman',
      avatar: 'assets/images/users/avatar-4.jpg',
      location: 'Valencia Town, Lahore',
      title: 'Valencia Branch Operations Manager',
      role: 'Branch Manager',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      token: Token,
    },
    {
      id: 3,
      username: 'ModeratorValencia',
      email: 'moderator.valencia@rainbow.com',
      password: '123456',
      firstName: 'Imran',
      lastName: 'Tariq',
      name: 'Imran Tariq',
      avatar: 'assets/images/users/avatar-2.jpg',
      location: 'Central Operations Hub',
      title: 'Central Operations & Queue Moderator',
      role: 'Moderator',
      branchCode: 'all',
      branchName: 'Cross-Branch Operations (All Outlets)',
      token: Token,
    },
    {
      id: 4,
      username: 'RainbowModerator',
      email: 'moderator@rainbow.com',
      password: '123456',
      firstName: 'Imran',
      lastName: 'Tariq',
      name: 'Imran Tariq',
      avatar: 'assets/images/users/avatar-2.jpg',
      location: 'Central Operations Hub',
      title: 'Central Operations & Queue Moderator',
      role: 'Moderator',
      branchCode: 'all',
      branchName: 'Cross-Branch Operations (All Outlets)',
      token: Token,
    },
    {
      id: 4,
      username: 'DispatcherValencia',
      email: 'dispatcher.valencia@rainbow.com',
      password: '123456',
      firstName: 'Haris',
      lastName: 'Mehmood',
      name: 'Haris Mehmood',
      avatar: 'assets/images/users/avatar-5.jpg',
      location: 'Valencia Town, Lahore',
      title: 'Store Staging & Dispatcher (Bay 1)',
      role: 'Dispatcher',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      token: Token,
    },
    {
      id: 5,
      username: 'RainbowAdmin',
      email: 'demo@demo.com',
      password: '123456',
      firstName: 'Rainbow Super',
      lastName: 'Admin',
      name: 'Rainbow Super Admin',
      avatar: 'assets/images/users/avatar-1.jpg',
      location: 'Lahore, Pakistan',
      title: 'Enterprise Super Administrator',
      role: 'Admin',
      branchCode: 'all',
      branchName: 'All Branches (Enterprise)',
      token: Token,
    },
  ]
  return users
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<MyRequestBody>,
    next: HttpHandler
  ): Observable<HttpEvent<Event>> {
    const authHeader = request.headers.get('Authorization')
    const isLoggedIn =
      authHeader && authHeader.startsWith('Bearer fake-jwt-token')
    let users: User[] = getUsers()
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(
        mergeMap(() => {
          let temp: User[] = []
          // authenticate - public
          if (request.url.endsWith('/api/login') && request.method === 'POST') {
            const user = users.find(
              (x) =>
                x.email === request.body?.email &&
                x.password === request.body?.password
            )
            if (!user) {
              return error('Email or password is incorrect')
            }
            return ok({
              ...user,
              name: user.firstName + ' ' + user.lastName,
            })
          }

          // store new user - public
          if (
            request.url.endsWith('/api/signup') &&
            request.method === 'POST'
          ) {
            const user = users.find(
              (x) =>
                x.email === request.body?.email &&
                x.password === request.body?.password
            )
            if (user) {
              return error('User Already Exists')
            } else {
              let [firstName, lastName] = request.body?.name.split(' ')!
              const newUser: User = {
                id: users.length + 1,
                username: firstName,
                email: request.body?.email,
                password: request.body?.password,
                firstName: firstName,
                lastName: lastName,
                avatar: 'assets/images/users/avatar-5.jpg',
                location: 'California, USA',
                token: Token,
              }
              temp = [...users]
              temp.push(newUser)
              sessionStorage.setItem('users', JSON.stringify(temp))
              return ok()
            }
          }

          // pass through any requests not handled above
          return next.handle(request)
        })
      )
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize())

    // private helper functions
    function ok(body?: User) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function unauthorised() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } })
    }

    function error(message: string) {
      return throwError({ status: 400, error: { message } })
    }
  }
}

export let FakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
}
