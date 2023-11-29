import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Vérifiez ici si l'utilisateur est authentifié
    const isAuthenticated = localStorage.getItem('id') !== null;

    if (isAuthenticated) {
      return true; // L'utilisateur est authentifié, permettez l'accès à la route
    } else {
      // Redirigez l'utilisateur vers une page de connexion ou une page d'erreur
      this.router.navigate(['/login']);
      console.log("access denied : not connected!");
      return false;
    }
  }
}
