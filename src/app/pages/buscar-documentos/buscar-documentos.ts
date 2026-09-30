import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentoService } from '../../services/documento.service';
import { TIPOS_DOCUMENTO, TipoDocumento } from '../../models/documento';

@Component({
  selector: 'app-buscar-documentos',
  imports: [RouterLink],
  templateUrl: './buscar-documentos.html',
})
export class BuscarDocumentos {
  private readonly documentoService = inject(DocumentoService);

  protected readonly tipos = TIPOS_DOCUMENTO;
  protected readonly texto = signal('');
  protected readonly tipo = signal<TipoDocumento | ''>('');
  protected readonly anioDesde = signal<number | null>(null);
  protected readonly anioHasta = signal<number | null>(null);

  protected readonly total = this.documentoService.total;
  protected readonly resultados = computed(() =>
    this.documentoService.buscar({
      texto: this.texto(),
      tipo: this.tipo(),
      anioDesde: this.anioDesde(),
      anioHasta: this.anioHasta(),
    }),
  );
  protected readonly hayFiltros = computed(
    () => !!this.texto() || !!this.tipo() || this.anioDesde() != null || this.anioHasta() != null,
  );

  protected actualizarTexto(evento: Event): void {
    this.texto.set((evento.target as HTMLInputElement).value);
  }

  protected actualizarTipo(evento: Event): void {
    this.tipo.set((evento.target as HTMLSelectElement).value as TipoDocumento | '');
  }

  protected actualizarAnio(campo: 'desde' | 'hasta', evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    const anio = valor === '' ? null : Number(valor);
    (campo === 'desde' ? this.anioDesde : this.anioHasta).set(anio);
  }

  protected limpiarFiltros(): void {
    this.texto.set('');
    this.tipo.set('');
    this.anioDesde.set(null);
    this.anioHasta.set(null);
  }

  protected eliminar(id: string, titulo: string): void {
    if (confirm(`¿Eliminar "${titulo}" de la biblioteca?`)) {
      this.documentoService.eliminar(id);
    }
  }
}
