import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'buscar' },
  {
    path: 'buscar',
    title: 'Buscar documentos',
    loadComponent: () =>
      import('./pages/buscar-documentos/buscar-documentos').then((m) => m.BuscarDocumentos),
  },
  {
    path: 'agregar',
    title: 'Agregar documento',
    loadComponent: () =>
      import('./pages/agregar-documento/agregar-documento').then((m) => m.AgregarDocumento),
  },
  { path: '**', redirectTo: 'buscar' },
];
