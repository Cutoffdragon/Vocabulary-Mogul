import { PLATFORM_ID } from '@angular/core'; // Import PLATFORM_ID
import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject } from '@angular/core'; // Inject the platformId dynamically

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);  // Inject the platformId
    let token = '';
    let user_id = '';

    // Only access localStorage if in the browser environment
    if (isPlatformBrowser(platformId)) {
        token = localStorage.getItem('token') || '';
        user_id = localStorage.getItem('user_id') || '';
    }

    // Clone the request and attach the Authorization header if token exists
    if (token) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `${token}`,
                user_id: `${user_id}`
            }
        });
        return next(clonedRequest);
    }

    // Proceed without modifying if no token is found
    return next(req);
};

