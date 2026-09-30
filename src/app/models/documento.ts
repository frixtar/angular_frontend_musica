export type TipoDocumento = 'Partitura' | 'Libro' | 'Grabación' | 'Revista' | 'Tesis';

export const TIPOS_DOCUMENTO: readonly TipoDocumento[] = [
  'Partitura',
  'Libro',
  'Grabación',
  'Revista',
  'Tesis',
];

export interface Documento {
  id: string;
  titulo: string;
  autor: string;
  tipo: TipoDocumento;
  anio: number;
  genero: string;
  descripcion: string;
  fechaRegistro: string;
}

export type NuevoDocumento = Omit<Documento, 'id' | 'fechaRegistro'>;

export interface FiltroDocumentos {
  texto: string;
  tipo: TipoDocumento | '';
  anioDesde: number | null;
  anioHasta: number | null;
}
