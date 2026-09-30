import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Documento, FiltroDocumentos, NuevoDocumento } from '../models/documento';

const STORAGE_KEY = 'biblioteca.documentos';

const DOCUMENTOS_INICIALES: Documento[] = [
  {
    id: 'doc-1',
    titulo: 'Las cuatro estaciones',
    autor: 'Antonio Vivaldi',
    tipo: 'Partitura',
    anio: 1725,
    genero: 'Barroco',
    descripcion: 'Conjunto de cuatro conciertos para violín y orquesta.',
    fechaRegistro: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'doc-2',
    titulo: 'El ruido eterno',
    autor: 'Alex Ross',
    tipo: 'Libro',
    anio: 2007,
    genero: 'Historia de la música',
    descripcion: 'Recorrido por la música del siglo XX.',
    fechaRegistro: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'doc-3',
    titulo: 'Kind of Blue',
    autor: 'Miles Davis',
    tipo: 'Grabación',
    anio: 1959,
    genero: 'Jazz',
    descripcion: 'Álbum de jazz modal grabado para Columbia Records.',
    fechaRegistro: '2026-01-01T00:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _documentos = signal<Documento[]>(this.cargar());

  readonly documentos = this._documentos.asReadonly();
  readonly total = computed(() => this._documentos().length);

  buscar(filtro: FiltroDocumentos): Documento[] {
    const texto = normalizar(filtro.texto.trim());
    return this._documentos().filter((doc) => {
      if (filtro.tipo && doc.tipo !== filtro.tipo) return false;
      if (filtro.anioDesde != null && doc.anio < filtro.anioDesde) return false;
      if (filtro.anioHasta != null && doc.anio > filtro.anioHasta) return false;
      if (!texto) return true;
      return [doc.titulo, doc.autor, doc.genero, doc.descripcion].some((campo) =>
        normalizar(campo).includes(texto),
      );
    });
  }

  agregar(nuevo: NuevoDocumento): Documento {
    const documento: Documento = {
      ...nuevo,
      id: crypto.randomUUID(),
      fechaRegistro: new Date().toISOString(),
    };
    this._documentos.update((docs) => [documento, ...docs]);
    this.guardar();
    return documento;
  }

  eliminar(id: string): void {
    this._documentos.update((docs) => docs.filter((doc) => doc.id !== id));
    this.guardar();
  }

  private cargar(): Documento[] {
    if (!this.esNavegador) return DOCUMENTOS_INICIALES;
    try {
      const guardados = localStorage.getItem(STORAGE_KEY);
      return guardados ? (JSON.parse(guardados) as Documento[]) : DOCUMENTOS_INICIALES;
    } catch {
      return DOCUMENTOS_INICIALES;
    }
  }

  private guardar(): void {
    if (!this.esNavegador) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._documentos()));
    } catch {
      // Almacenamiento no disponible: los cambios se mantienen solo en memoria.
    }
  }
}

function normalizar(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
