import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface Service {
    id: string;
    name: string;
    description: string;
    createDatetime: string;
    updateDatetime: string;
}

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    private apiUrl = 'https://businessitprueba-dkasevh6gchwcqc5.canadacentral-01.azurewebsites.net/apiservices';
    
    constructor(private http: HttpClient) { }

    getServices(): Observable<Service[]> {
        return this.http.get<Service[]>(this.apiUrl);
    }

    getServicesByID(id: string): Observable<Service> {
        return this.http.get<Service>(this.apiUrl + "/" + id);
    }

    createService(service: object): Observable<Service> {
        return this.http.post<Service>(this.apiUrl, service);
    }

    updateService(id: string, service: object): Observable<Service> {
        return this.http.put<Service>(this.apiUrl + "/" + id, service);
    }

    deleteService(id: string): Observable<Service> {
        return this.http.delete<Service>(this.apiUrl + "/" + id);
    }
}
