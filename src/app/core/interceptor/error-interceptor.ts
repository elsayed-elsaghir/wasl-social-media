import { HttpInterceptorFn, type HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const token = localStorage.getItem('token');
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (token) {
        toastr.error(err.error.message);
      }
      return throwError(() => err);
    }),
  );
};
