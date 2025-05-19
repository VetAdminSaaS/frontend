import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApoderadosComponent } from './apoderados.component';
import { ApoderadoService } from '../../../../core/services/apoderado.service';
import { AuthService } from '../../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TipoDocumentoIdentidad } from '../../../../shared/models/empleado-profile.model';
import { Genero } from '../../../../shared/models/empleado-profile.model';

describe('ApoderadosComponent', () => {
  let component: ApoderadosComponent;
  let fixture: ComponentFixture<ApoderadosComponent>;
  let apoderadoServiceSpy: jasmine.SpyObj<ApoderadoService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const apoderadoSpy = jasmine.createSpyObj('ApoderadoService', ['obtenerTodosLosApoderados', 'crearApoderadoByAdmin', 'actualizarApoderado', 'eliminarApoderado']);
    const authSpy = jasmine.createSpyObj('AuthService', ['suspendeCuentaUsuario']);

    await TestBed.configureTestingModule({
      imports: [ApoderadosComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ApoderadoService, useValue: apoderadoSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApoderadosComponent);
    component = fixture.componentInstance;
    apoderadoServiceSpy = TestBed.inject(ApoderadoService) as jasmine.SpyObj<ApoderadoService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with valid controls', () => {
    component.initForm();
    expect(component.apoderadoForm).toBeTruthy();
    expect(component.apoderadoForm.controls['nombre'].valid).toBeFalse();
    component.apoderadoForm.controls['nombre'].setValue('Juan');
    expect(component.apoderadoForm.controls['nombre'].valid).toBeTrue();
  });

  it('should call obtenerApoderados and populate list', () => {
    const mockApoderados = [{ id: 1, nombre: 'Juan', apellido: 'Pérez', numeroIdentificacion: '12345678', email: 'juan@mail.com', tipoDocumentoIdentidad: TipoDocumentoIdentidad.DNI, direccion: 'Av. Lima 123', telefono: '987654321', provincia: 'Lima', distrito: 'Miraflores', genero: Genero.MASCULINO, fechaNacimiento: '1990-01-01', departamento: 'Lima', updated: '2023-01-01', profilePath: 'path/to/profile.jpg' }];
    apoderadoServiceSpy.obtenerTodosLosApoderados.and.returnValue(of(mockApoderados));

    component.obtenerApoderados();
    expect(component.apoderados.length).toBe(1);
    expect(component.filteredApoderados.length).toBe(1);
  });

  it('should handle error when obtenerApoderados fails', () => {
    apoderadoServiceSpy.obtenerTodosLosApoderados.and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    component.obtenerApoderados();
    expect(console.error).toHaveBeenCalled();
  });

  it('should filter apoderados by searchTerm', () => {
    component.apoderados = [
      {
        id: 1,
        nombre: 'Ana',
        apellido: 'Sánchez',
        numeroIdentificacion: '12345678',
        tipoDocumentoIdentidad: TipoDocumentoIdentidad.DNI,
        email: 'ana@mail.com',
        direccion: 'Av. Lima 123',
        telefono: '987654321',
        provincia: 'Lima',
        distrito: 'Miraflores',
        genero: Genero.FEMENINO,
        fechaNacimiento: '1990-01-01',
        departamento: 'Lima',
        updated: '2023-01-01',
        profilePath: 'path/to/profile.jpg'
      },
      {
        id: 2,
        nombre: 'Carlos',
        apellido: 'Ramírez',
        numeroIdentificacion: '87654321',
        tipoDocumentoIdentidad: TipoDocumentoIdentidad.DNI,
        email: 'carlos@mail.com',
        direccion: 'Av. Arequipa 456',
        telefono: '912345678',
        provincia: 'Lima',
        distrito: 'San Isidro',
        genero: Genero.MASCULINO,
        fechaNacimiento: '1985-05-10',
        departamento: 'Lima',
        updated: '2023-01-01',
        profilePath: 'path/to/profile.jpg'
      }
    ];
    
    component.searchTerm = 'ana';
    component.filterApoderados();
    expect(component.filteredApoderados.length).toBe(1);
  });

  it('should switch tabs correctly', () => {
    component.setActiveTab('contacto');
    expect(component.activeTab).toBe('contacto');
  });

  it('should go to next and previous page', () => {
    component.filteredApoderados = Array(25).fill({ id: 1, nombre: 'test', apellido: 'test', numeroIdentificacion: '00000000', email: 'test@mail.com' });
    component.pageSize = 10;
    component.currentPage = 1;

    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.previousPage();
    expect(component.currentPage).toBe(1);
  });
});
