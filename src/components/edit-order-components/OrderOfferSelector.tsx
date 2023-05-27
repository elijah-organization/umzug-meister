import { Button, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { AppCard } from '../shared/AppCard';
import { AppDataGrid } from '../shared/AppDataGrid';

import { AppPrice } from 'um-types';

export default function OrderOfferSelector() {
  const prices = useAppServices<AppPrice>('Price');
  const order = useCurrentOrder();

  const dispatch = useDispatch<AppDispatch>();

  let data = [...prices];

  if (order !== null) {
    const { transporterNumber, workersNumber, t75, timeBased } = order;
    if (workersNumber) {
      data = data.filter((d) => d.workers === workersNumber);
    }
    if (transporterNumber) {
      data = data.filter((d) => d.t35 === transporterNumber);
    }
    if (t75) {
      data = data.filter((d) => d.t75 === t75);
    }
    if (timeBased?.hours) {
      data = data.filter((d) => d.includedHours == timeBased.hours);
    }
  }

  const setPrice = useCallback(
    (id: number | string) => {
      const offer = prices.find((p) => p.id == id);
      if (offer) {
        const timeBasedValue = {
          basis: offer.sum,
          hours: offer.includedHours,
          extra: offer.hourPrice,
        };
        dispatch(updateOrderProps({ path: ['timeBased'], value: timeBasedValue }));
        dispatch(updateOrderProps({ path: ['t75'], value: offer.t75 }));
        dispatch(updateOrderProps({ path: ['transporterNumber'], value: offer.t35 }));
        dispatch(updateOrderProps({ path: ['workersNumber'], value: offer.workers }));
      }
    },
    [dispatch, prices],
  );

  const columns = useMemo(() => {
    const cols: GridColDef[] = [
      { field: 'workers', headerName: 'Mann', flex: 1 },
      { field: 't35', headerName: '3.5', flex: 1 },
      { field: 't75', headerName: '7.5', flex: 1 },
      { field: 'includedHours', headerName: 'Stunden', flex: 1 },
      { field: 'hourPrice', headerName: 'Stundenpreis', flex: 1 },
      { field: 'ridingCosts', headerName: 'Anfahrtskosten', flex: 1 },

      { field: 'sum', headerName: 'Gesamt', flex: 1 },
      {
        field: 'id',
        headerName: '',
        renderCell({ value }) {
          return (
            <Button onClick={() => setPrice(value)} variant="outlined" disableElevation>
              Setzen
            </Button>
          );
        },
      },
    ];
    return cols;
  }, []);

  return (
    <Grid item xs={12}>
      <AppCard title="Aktuelle Angebote">
        <AppDataGrid columns={columns} data={data} disablePagination paginationMode="client" />
      </AppCard>
    </Grid>
  );
}
