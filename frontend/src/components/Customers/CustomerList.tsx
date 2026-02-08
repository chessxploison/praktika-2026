import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  TextField,
  Select,
  IconAdd,
  IconEdit,
  IconTrash,
  IconSearch,
  Badge
} from '@consta/uikit';
import { customerService, Customer, CustomerFilter } from '../../services/customerService';
import { useNavigate } from 'react-router-dom';

interface TableColumn {
  title: string;
  accessor: keyof Customer | ((row: Customer) => React.ReactNode);
  sortable?: boolean;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CustomerFilter>({});
  
  const navigate = useNavigate();

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.search(filter);
      setCustomers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Удалить контрагента?')) {
      try {
        await customerService.delete(id);
        loadCustomers();
      } catch (error) {
        alert('Ошибка удаления');
      }
    }
  };

  const columns: TableColumn[] = [
    {
      title: 'Код',
      accessor: 'customerCode',
      sortable: true,
    },
    {
      title: 'Наименование',
      accessor: 'customerName',
      sortable: true,
    },
    {
      title: 'ИНН',
      accessor: 'customerInn',
    },
    {
      title: 'Тип',
      accessor: (row) => (
        <Badge
          status={row.isOrganization ? 'normal' : 'system'}
          label={row.isOrganization ? 'Юр. лицо' : 'Физ. лицо'}
        />
      ),
    },
    {
      title: 'Email',
      accessor: 'customerEmail',
    },
    {
      title: 'Действия',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="xs"
            view="primary"
            iconLeft={IconEdit}
            onClick={() => navigate(`/customers/edit/${row.customerCode}`)}
          />
          <Button
            size="xs"
            view="alert"
            iconLeft={IconTrash}
            onClick={() => handleDelete(row.customerCode)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <h2>Справочник контрагентов</h2>
        <Button
          label="Добавить"
          iconLeft={IconAdd}
          onClick={() => navigate('/customers/new')}
        />
      </div>

      {/* Фильтры */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <TextField
          label="Наименование"
          value={filter.name || ''}
          onChange={({ value }) => setFilter({ ...filter, name: value || undefined })}
          width="full"
        />
        <TextField
          label="ИНН"
          value={filter.inn || ''}
          onChange={({ value }) => setFilter({ ...filter, inn: value || undefined })}
        />
        <Select
          label="Тип"
          items={[
            { label: 'Все', value: undefined },
            { label: 'Юридические лица', value: true },
            { label: 'Физические лица', value: false }
          ]}
          value={filter.isOrganization}
          onChange={({ value }) => setFilter({ ...filter, isOrganization: value })}
        />
        <Button
          label="Поиск"
          iconLeft={IconSearch}
          onClick={loadCustomers}
        />
        <Button
          label="Сбросить"
          view="ghost"
          onClick={() => {
            setFilter({});
            loadCustomers();
          }}
        />
      </div>

      {/* Таблица */}
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <Table
          rows={customers}
          columns={columns}
          borderBetweenColumns
          borderBetweenRows
          zebraStriped="odd"
          emptyRowsPlaceholder={<div style={{ padding: '20px', textAlign: 'center' }}>Нет данных</div>}
        />
      )}
    </div>
  );
};

export default CustomerList;
