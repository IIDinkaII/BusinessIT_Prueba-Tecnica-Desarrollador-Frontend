import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Clients } from './pages/clients/clients';
import { Services } from './pages/services/services';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home},
    { path: 'clients', component: Clients },
    { path: 'services', component: Services },
];
