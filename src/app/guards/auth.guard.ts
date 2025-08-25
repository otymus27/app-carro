import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importe o AuthService
import { map, take } from 'rxjs/operators'; // Importe os operadores map e take


export const AuthGuard: CanActivateFn =(routes, state)=> {

  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ CORREÇÃO: Observe isLoggedIn$ e mapeie seu valor
  return authService.isLoggedIn$.pipe(
    take(1), // Pega apenas o primeiro valor emitido e completa
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login']); // Redireciona para o login se não estiver logado
        return false;
      }
    })
  );
}
