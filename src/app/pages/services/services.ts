import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Service, ServicesService } from '../../services/services.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  
    services: Service[] = [];
    selectedService: Service | null = null;
    newService: Partial<Service> = {
      name: '',
      description: ''
    };

  constructor(
    private servicesService: ServicesService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
  ) {
    this.loadServices();
  }

  loadServices() {
    this.servicesService.getServices().subscribe({
      next: (data) => {
        this.services = [...data];
        this.cd.markForCheck();
        console.log("[READ DATA]", this.services)
      },
      error: (err) => console.error(err),
    });
  }

  openServiceModal(content: any, service: Service) {
    this.servicesService.getServicesByID(service.id).subscribe({
      next: (data) => {
        this.selectedService = data;
        this.modalService.open(content, { centered: true });
      },
      error: (err) => console.error(err),
    });
  }

  // CREATE ENTITY

  openCreateModal(content: any) {
    // RESET FORM
    this.newService = { name: '', description: '' };
    this.modalService.open(content, { centered: true });
  }

  createService(modal: any) {
    if (!this.newService.name || !this.newService.description) return;

    this.servicesService.createService(this.newService).subscribe({
      next: () => {
        this.loadServices();
        modal.close();
      },
      error: (err) => console.error(err),
    });
  }

  // UPDATE ENTITY
  openUpdateModal(content: any, service: Service) {
    this.selectedService = {...service}; // CLONE DATA
    this.modalService.open(content, { centered: true });
  }

  submitUpdate(modal: any) {
    if (!this.selectedService) return;

    this.servicesService.updateService(this.selectedService.id, this.selectedService)
      .subscribe({
        next: () => {
          // RELOAD UI
          this.loadServices();
          this.cd.markForCheck();
          modal.close(); 
        },
        error: (err) => console.error(err)
      });
  }

  // DELETE ENTITY
  submitDelete(id: string) {
    this.servicesService.deleteService(id)
      .subscribe({
        next: () => {
          // RELOAD UI
          this.loadServices();
        },
        error: (err) => console.error(err)
      });
  }
}
