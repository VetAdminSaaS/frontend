import { Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { RegisterComponent } from "./register/register.component";
import { RecuperarContrasenaComponent } from "./recuperar-contrasena/recuperar-contrasena.component";
import { AuthCallbackComponent } from "./auth-callback/auth-callback.component";
import { ReactivarCuentaComponent } from "./reactivar-cuenta/reactivar-cuenta.component";
import { CuentaSuspendidaInformationComponent } from "./cuenta-suspendida-information/cuenta-suspendida-information.component";

export const authRoutes: Routes = [
    {
        path: 'login', component: AuthComponent
    },
    {
        path:'register', component: RegisterComponent
    },
    {
        path:'forgot', component:RecuperarContrasenaComponent
    },
    {
        path: 'auth/callback', component: AuthCallbackComponent
    },
    {
        path: 'reactivar', component:ReactivarCuentaComponent    
    },
    {
        path:'cuenta-suspendida',component:CuentaSuspendidaInformationComponent
    }

   
]