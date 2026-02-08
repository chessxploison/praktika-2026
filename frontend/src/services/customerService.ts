import api from './api';

export interface Customer {
  customerCode: string;
  customerName: string;
  customerInn?: string;
  customerKpp?: string;
  customerLegalAddress?: string;
  customerPostalAddress?: string;
  customerEmail?: string;
  customerCodeMain?: string;
  isOrganization: boolean;
  isPerson: boolean;
}

export interface CustomerFilter {
  name?: string;
  inn?: string;
  isOrganization?: boolean;
}

export const customerService = {
  getAll: () => api.get<Customer[]>('/customers'),
  
  search: (filters: CustomerFilter) => 
    api.get<Customer[]>('/customers/search', { params: filters }),
  
  getById: (id: string) => api.get<Customer>(`/customers/${id}`),
  
  create: (customer: Omit<Customer, 'id'>) => 
    api.post<Customer>('/customers', customer),
  
  update: (id: string, customer: Partial<Customer>) => 
    api.put<Customer>(`/customers/${id}`, customer),
  
  delete: (id: string) => api.delete(`/customers/${id}`),
};
