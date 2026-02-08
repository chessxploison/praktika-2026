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
import { lotService, Lot, LotFilter } from '../../services/lotService';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface TableColumn {
  title: string;
  accessor: keyof Lot | ((row: Lot) => React.ReactNode);
  sortable?: boolean;
}

const LotList: React.FC = () => {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LotFilter>({});
  
  const navigate = useNavigate();

  const loadLots = async () => {
    try {
      setLoading(true);
      const response = await lotService.search(filter);
      setLots(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLots();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить лот?')) {
      try {
        await lotService.delete(id);
        loadLots();
      } catch (error) {
        alert('Ошибка удаления');
      }
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : currency === 'EUR' ? 'EUR' : 'RUB',
    }).format(price);
  };

  const columns: TableColumn[] = [
    {
      title: 'Наименование',
      accessor: 'lotName',
      sortable: true,
    },
    {
      title: 'Контрагент',
      accessor: 'customerCode',
    },
    {
      title: 'Стоимость',
      accessor: (row) => formatPrice(row.price, row.currencyCode),
      sortable: true,
    },
    {
      title: 'Валюта',
      accessor: 'currencyCode',
    },
    {
      title: 'НДС',
      accessor: 'ndsRate',
    },
    {
      title: 'Дата доставки',
      accessor: (row) => row.dateDelivery 
        ? format(new Date(row.dateDelivery), 'dd.MM.yyyy HH:mm')
        : '-',
    },
    {
      title: 'Действия',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="xs"
            view="primary"
            iconLeft={IconEdit}
            onClick={() => navigate(`/lots/edit/${row.id}`)}
          />
          <Button
            size="xs"
            view="alert"
            iconLeft={IconTrash}
            onClick={() => handleDelete(row.id)}
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
        <h2>Лоты закупок</h2>
        <Button
          label="Добавить лот"
          iconLeft={IconAdd}
          onClick={() => navigate('/lots/new')}
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
          label="Наименование лота"
          value={filter.lotName || ''}
          onChange={({ value }) => setFilter({ ...filter, lotName: value || undefined })}
          width="full"
        />
        <TextField
          label="Код контрагента"
          value={filter.customerCode || ''}
          onChange={({ value }) => setFilter({ ...filter, customerCode: value || undefined })}
        />
        <Select
          label="Валюта"
          items={[
            { label: 'Все', value: undefined },
            { label: 'RUB', value: 'RUB' },
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' }
          ]}
          value={filter.currencyCode}
          onChange={({ value }) => setFilter({ ...filter, currencyCode: value })}
        />
        <Button
          label="Поиск"
          iconLeft={IconSearch}
          onClick={loadLots}
        />
        <Button
          label="Сбросить"
          view="ghost"
          onClick={() => {
            setFilter({});
            loadLots();
          }}
        />
      </div>

      {/* Таблица */}
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <Table
          rows={lots}
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

export default LotList;
