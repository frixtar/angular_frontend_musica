import { TestBed } from '@angular/core/testing';
import { DocumentoService } from './documento.service';

describe('DocumentoService', () => {
  let service: DocumentoService;
  const sinFiltros = { texto: '', tipo: '' as const, anioDesde: null, anioHasta: null };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoService);
  });

  it('busca por texto ignorando mayúsculas y acentos', () => {
    const resultados = service.buscar({ ...sinFiltros, texto: 'musica' });
    expect(resultados.map((d) => d.titulo)).toEqual(['El ruido eterno']);
  });

  it('filtra por tipo y rango de años', () => {
    expect(service.buscar({ ...sinFiltros, tipo: 'Grabación' }).length).toBe(1);
    expect(service.buscar({ ...sinFiltros, anioDesde: 1900, anioHasta: 2000 }).length).toBe(1);
  });

  it('agrega y elimina documentos', () => {
    const doc = service.agregar({
      titulo: 'Réquiem',
      autor: 'W. A. Mozart',
      tipo: 'Partitura',
      anio: 1791,
      genero: 'Clásico',
      descripcion: '',
    });
    expect(service.total()).toBe(4);
    expect(service.buscar({ ...sinFiltros, texto: 'requiem' })[0].id).toBe(doc.id);

    service.eliminar(doc.id);
    expect(service.total()).toBe(3);
  });
});
