import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [NavbarComponent, SidebarFactusComponent, CommonModule, FormsModule, DatePipe],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent implements OnInit {
  currentDate: Date = new Date();
  isCheckedIn: boolean = false;
  showModal = false;
  selectedTime = '';
  registrationNotes = '';
  currentLocation: string = 'Obteniendo ubicación...';
  currentTime: string = '';
  attendanceHistory: any[] = [];
  workHours: string = '4h 25m';
  monthlyHours: number = 168;
  attendanceRate: number = 98;
  pendingApprovals: number = 3;

  ngOnInit(): void {
    this.getCurrentTime();
    this.getLocation();
  }

  getCurrentTime() {
    const now = new Date();
    this.currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
        },
        (error) => {
          console.error('Error getting location:', error);
          this.currentLocation = 'Ubicación no disponible';
        }
      );
    } else {
      this.currentLocation = 'Geolocalización no soportada';
    }
  }

  openModal() {
    this.showModal = true;
    this.getCurrentTime();
    this.selectedTime = this.currentTime;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTime = '';
    this.registrationNotes = '';
  }

  setCurrentTime() {
    this.getCurrentTime();
    this.selectedTime = this.currentTime;
  }

  registerAttendance() {
    if (this.selectedTime) {
      const newEntry = {
        date: new Date(),
        entryTime: this.isCheckedIn ? null : this.selectedTime,
        exitTime: this.isCheckedIn ? this.selectedTime : null,
        status: this.isCheckedIn ? 'Completado' : 'En curso',
        hours: this.workHours,
        notes: this.registrationNotes
      };

      this.attendanceHistory.unshift(newEntry);
      this.isCheckedIn = !this.isCheckedIn;
      
      console.log('Registro guardado:', newEntry);
      this.closeModal();
    }
  }
}