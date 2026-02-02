import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Client, ClientList, ClientService } from '../../services/clients.service';
import { FormsModule } from '@angular/forms';
import { Service, ServicesService } from '../../services/services.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients {

  clients: ClientList[] = [];
  selectedClient: Client | null = null;
  selectedClientShort: ClientList | null = null;
  newClient: Partial<Client> = {
    name: '',
    email: ''
  };

  availableServices: Service[] = [];
  selectedServiceToAdd: Service | null = null;

  constructor(
    private clientService: ClientService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private serviceService: ServicesService,
  ) {
    this.loadClients();
    this.loadServices();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (data) => { 
        this.clients = [...data]; 
        this.cd.markForCheck();
        console.log("[READ DATA]", this.clients) 
      },
      error: (err) => console.error(err),
    });
  }

  loadServices() {
    this.serviceService.getServices().subscribe({
      next: data => this.availableServices = data,
      error: err => console.error(err)
    });
  }

  openClientModal(content: any, client: ClientList) {
    this.clientService.getClientByID(client.id).subscribe({
      next: (data) => { 
        this.selectedClient = data; 
        this.selectedServiceToAdd = null; // RESET
        this.modalService.open(content, { centered: true }); 
      },
      error: (err) => console.error(err),
    });
  } 

  // CREATE ENTITY

  openCreateModal(content: any) {
    // RESET FORM
    this.newClient = { name: '', email: '' };
    this.modalService.open(content, { centered: true });
  }

  createClient(modal: any) {
    if (!this.newClient.name || !this.newClient.email) return;

    this.clientService.createClient(this.newClient).subscribe({
      next: () => {
        this.loadClients(); 
        modal.close(); 
      },
      error: (err) => console.error(err),
    });
  }

  // UPDATE ENTITY
  openUpdateModal(content: any, client: ClientList) {
    this.selectedClientShort = {...client} ; // CLONE DATA
    this.modalService.open(content, { centered: true });
  }

  submitUpdate(modal: any) {
    if (!this.selectedClientShort) return;

    this.clientService.updateClient(this.selectedClientShort.id, this.selectedClientShort)
      .subscribe({
        next: () => {
          // RELOAD UI
          this.loadClients(); 
          this.cd.markForCheck();
          modal.close();
        },
        error: (err) => console.error(err)
      });
  }

  // DELETE ENTITY
  submitDelete(id: string) {
    this.clientService.deleteClient(id)
      .subscribe({
        next: () => {
          // RELOAD UI
          this.loadClients();
        },
        error: (err) => console.error(err)
      });
  }

  // ADD RELATION SERVICES - CLIENT

  addService() {
    if (!this.selectedClient || !this.selectedServiceToAdd) return;

    // NOT DUPLICATE IDS
    if (!this.selectedClient.services.some(s => s.id === this.selectedServiceToAdd!.id)) {
      this.selectedClient.services.push(this.selectedServiceToAdd);

      this.clientService.updateClient(this.selectedClient.id, this.selectedClient).subscribe({
        next: updated => console.log('SERVICE ADD - CLIENT RELATION', updated),
        error: err => console.error(err)
      });
    }
  }


  removeService(serviceName: string) {
    if (!this.selectedClient) return;

    this.selectedClient.services = this.selectedClient.services.filter(s => s.name !== serviceName);

    this.clientService.updateClient(this.selectedClient.id, this.selectedClient).subscribe({
      next: updated => console.log('SERVICE ELIMINATED - CLIENT RELATION', updated),
      error: err => console.error(err)
    });
  }
}
