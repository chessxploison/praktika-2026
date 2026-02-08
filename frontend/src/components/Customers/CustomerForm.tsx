import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Checkbox,
  IconSave,
  IconClose
} from '@consta/uikit';
import { customerService, Customer } from '../../services/customerService';
import { useNavigate, useParams } from 'react-router-dom';

const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    isOrganization: false,
    isPerson: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && id) {
      loadCustomer(id);
    }
  }, [id, isEditMode]);

  const loadCustomer = async (customerId: string) => {
    try {
      setLoading(true);
      const response = await customerService.getById(customerId);
      setFormData(response.data);
    } catch (error) {
      alert('Ошибка загрузки данных');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerCode) {
      newErrors.customerCode = 'Обязательное поле';
    }
    if (!formData.customerName) {
      newErrors.customerName = 'Обязательное поле';
    }
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Неверный формат email';
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
        await customerService.update(id, formData);
        alert('Контрагент обновлен');
      } else {
        await customerService.create(formData as Customer);
        alert('Контрагент создан');
      }
      navigate('/customers');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Customer, value: any) => {
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
      <h2>{isEditMode ? 'Редактирование контрагента' : 'Новый контрагент'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Код контрагента *"
            value={formData.customerCode || ''}
            onChange={({ value }) => handleChange('customerCode', value)}
            disabled={isEditMode}
            status={errors.customerCode ? 'alert' : undefined}
            caption={errors.customerCode}
            required
          />
          
          <TextField
            label="Наименование *"
            value={formData.customerName || ''}
            onChange={({ value }) => handleChange('customerName', value)}
            status={errors.customerName ? 'alert' : undefined}
            caption={errors.customerName}
            required
          />
          
          <TextField
            label="ИНН"
            value={formData.customerInn || ''}
            onChange={({ value }) => handleChange('customerInn', value)}
          />
          
          <TextField
            label="КПП"
            value={formData.customerKpp || ''}
            onChange={({ value }) => handleChange('customerKpp', value)}
          />
          
          <TextField
            label="Юридический адрес"
            value={formData.customerLegalAddress || ''}
            onChange={({ value }) => handleChange('customerLegalAddress', value)}
          />
          
          <TextField
            label="Почтовый адрес"
            value={formData.customerPostalAddress || ''}
            onChange={({ value }) => handleChange('customerPostalAddress', value)}
          />
          
          <TextField
            label="Email"
            value={formData.customerEmail || ''}
            onChange={({ value }) => handleChange('customerEmail', value)}
            status={errors.customerEmail ? 'alert' : undefined}
            caption={errors.customerEmail}
          />
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <Checkbox
              label="Юридическое лицо"
              checked={formData.isOrganization || false}
              onChange={({ checked }) => {
                handleChange('isOrganization', checked);
                if (checked) handleChange('isPerson', false);
              }}
            />
            <Checkbox
              label="Физическое лицо"
              checked={formData.isPerson || false}
              onChange={({ checked }) => {
                handleChange('isPerson', checked);
                if (checked) handleChange('isOrganization', false);
              }}
            />
          </div>
          
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
              onClick={() => navigate('/customers')}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
