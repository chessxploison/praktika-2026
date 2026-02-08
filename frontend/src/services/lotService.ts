import api from './api';

export interface Lot {
  id: number;
  lotName: string;
  customerCode: string;
  price: number;
  currencyCode: 'RUB' | 'USD' | 'EUR';
  ndsRate: 'Без НДС' | '18%' | '20%';
  placeDelivery?: string;
  dateDelivery?: string;
}

export interface LotFilter {
  lotName?: string;
  customerCode?: string;
  currencyCode?: string;
}

export const lotService = {
  getAll: () => api.get<Lot[]>('/lots'),
  
  search: (filters: LotFilter) => 
    api.get<Lot[]>('/lots/search', { params: filters }),
  
  getById: (id: number) => api.get<Lot>(`/lots/${id}`),
  
  create: (lot: Omit<Lot, 'id'>) => 
    api.post<Lot>('/lots', lot),
  
  update: (id: number, lot: Partial<Lot>) => 
    api.put<Lot>(`/lots/${id}`, lot),
  
  delete: (id: number) => api.delete(`/lots/${id}`),
};
