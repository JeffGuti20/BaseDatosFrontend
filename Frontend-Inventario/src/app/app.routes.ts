import { Routes } from '@angular/router';
import {Home} from './components/home/home';
import {Login} from './components/login/login';
import { Error } from './components/error/error';
import {Suppliers} from './components/suppliers/suppliers';
import {RoleManagement} from './components/role-management/role-management';
import {Supplies} from './components/supplies/supplies';
import {Categories} from './components/categories/categories';


import { routeGuard } from './core/guards/routes.guard';
import { adminGuard } from './core/guards/admin.guard';
export const routes: Routes = [
    {path:'',component:Home},
    {path:'home',component:Home},
    {path:'login',component:Login},
    {path:'role',component:RoleManagement, canActivate:[adminGuard]},
    {path:'supplies',component:Supplies, canActivate:[routeGuard]},
    {path:'suppliers',component:Suppliers, canActivate:[routeGuard]},
    {path:'categories',component:Categories, canActivate:[routeGuard]},



    {path:'**',component:Error},
];
