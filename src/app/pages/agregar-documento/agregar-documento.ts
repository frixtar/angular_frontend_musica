import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DocumentoService } from '../../services/documento.service';
import { TIPOS_DOCUMENTO, TipoDocumento } from '../../models/documento';

@Component({
  selector: 'app-agregar-documento',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agregar-documento.html',
})
export class AgregarDocumento {
  private readonly documentoService = inject(DocumentoService);
  private readonly router = inject(Router);

  protected readonly tipos = TIPOS_DOCUMENTO;
  protected readonly anioMaximo = new Date().getFullYear();
  protected readonly mensaje = signal<string | null>(null);

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(200)]],
    autor: ['', [Validators.required, Validators.maxLength(120)]],
    tipo: ['' as TipoDocumento | '', Validators.required],
    anio: [
      null as number | null,
      [Validators.required, Validators.min(1000), Validators.max(this.anioMaximo)],
    ],
    genero: ['', Validators.maxLength(80)],
    descripcion: ['', Validators.maxLength(1000)],
  });

  protected invalido(campo: keyof typeof this.formulario.controls): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.dirty || control.touched);
  }

  protected guardar(seguirAgregando: boolean): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valor = this.formulario.getRawValue();
    const documento = this.documentoService.agregar({
      titulo: valor.titulo.trim(),
      autor: valor.autor.trim(),
      tipo: valor.tipo as TipoDocumento,
      anio: Number(valor.anio),
      genero: valor.genero.trim(),
      descripcion: valor.descripcion.trim(),
    });

    if (seguirAgregando) {
      this.formulario.reset();
      this.mensaje.set(`"${documento.titulo}" se agregó a la biblioteca.`);
    } else {
      this.router.navigate(['/buscar']);
    }
  }

  protected cancelar(): void {
    this.formulario.reset();
    this.mensaje.set(null);
  }
}
