import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Select,
  DatePicker,
  IconSave,
  IconClose
} from '@consta/uikit';
import { lotService, Lot } from '../../services/lotService';
import { useNavigate, useParams } from 'react-router-dom';

const currencyOptions = [
  { label: 'RUB', value: 'RUB' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' }
];

const ndsOptions = [
  { label: 'Без НДС', value: 'Без НДС' },
  { label: '18%', value: '18%' },
  { label: '20%', value: '20%' }
];

const LotForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<Partial<Lot>>({
    currencyCode: 'RUB',
    ndsRate: '20%',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && id) {
      loadLot(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadLot = async (lotId: number) => {
    try {
      setLoading(true);
      const response = await lotService.getById(lotId);
      setFormData(response.data);
    } catch (error) {
      alert('Ошибка загрузки данных');
      navigate('/lots');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.lotName) {
      newErrors.lotName = 'Обязательное поле';
    }
    if (!formData.customerCode) {
      newErrors.customerCode = 'Обязательное поле';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Цена должна быть положительной';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (isEditMode && id) {
        await lotService.update(parseInt(id), formData);
        alert('Лот обновлен');
      } else {
        await lotService.create(formData as Lot);
        alert('Лот создан');
      }
      navigate('/lots');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Lot, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading && isEditMode) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>{isEditMode ? 'Редактирование лота' : 'Новый лот'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Наименование лота *"
            value={formData.lotName || ''}
            onChange={({ value }) => handleChange('lotName', value)}
            status={errors.lotName ? 'alert' : undefined}
            caption={errors.lotName}
            required
          />
          
          <TextField
            label="Код контрагента *"
            value={formData.customerCode || ''}
            onChange={({ value }) => handleChange('customerCode', value)}
            status={errors.customerCode ? 'alert' : undefined}
            caption={errors.customerCode}
            required
          />
          
          <TextField
            type="number"
            label="Цена *"
            value={formData.price?.toString() || ''}
            onChange={({ value }) => handleChange('price', parseFloat(value || '0'))}
            status={errors.price ? 'alert' : undefined}
            caption={errors.price}
            required
            min="0"
            step="0.01"
          />
          
          <Select
            label="Валюта *"
            items={currencyOptions}
            value={formData.currencyCode}
            onChange={({ value }) => handleChange('currencyCode', value)}
            required
          />
          
          <Select
            label="Ставка НДС *"
            items={ndsOptions}
            value={formData.ndsRate}
            onChange={({ value }) => handleChange('ndsRate', value)}
            required
          />
          
          <TextField
            label="Грузополучатель"
            value={formData.placeDelivery || ''}
            onChange={({ value }) => handleChange('placeDelivery', value)}
          />
          
          <DatePicker
            label="Дата доставки"
            value={formData.dateDelivery ? new Date(formData.dateDelivery) : null}
            onChange={({ value }) => handleChange('dateDelivery', value?.toISOString())}
            style={{ width: '100%' }}
          />
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            <Button
              type="submit"
              label="Сохранить"
              iconLeft={IconSave}
              loading={loading}
            />
            <Button
              label="Отмена"
              view="ghost"
              iconLeft={IconClose}
              onClick={() => navigate('/lots')}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default LotForm;
