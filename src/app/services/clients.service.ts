import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface Service {
    id?: string;
    name: string;
    description: string;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    createDatetime: string;
    updateDatetime: string;
    services: Service[];
}

export interface ClientList {
    id: string;
    name: string;
    email: string;
}
@Injectable({
    providedIn: 'root',
})
export class ClientService {
    
    //private apiUrl = environment.apiUrl + '/clients';
    private apiUrl = 'https://businessitprueba-dkasevh6gchwcqc5.canadacentral-01.azurewebsites.net/api/clients';

    constructor(private http: HttpClient) { }

    getClients(): Observable<ClientList[]> {
        return this.http.get<ClientList[]>(this.apiUrl);
    }

    getClientByID(id:string): Observable<Client> {
        return this.http.get<Client>(this.apiUrl + "/" + id);
    }

    createClient(client:object): Observable<Client> {
        return this.http.post<Client>(this.apiUrl, client);
    }

    updateClient(id:string, client: object): Observable<Client> {
        return this.http.put<Client>(this.apiUrl + "/" + id, client);
    }

    deleteClient(id: string): Observable<Client> {
        return this.http.delete<Client>(this.apiUrl + "/" + id);
    }
}
