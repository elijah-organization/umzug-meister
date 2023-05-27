import { Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import AddButton from '../components/shared/AddButton';
import { AppCard } from '../components/shared/AppCard';
import { AppDataGrid } from '../components/shared/AppDataGrid';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { useAppFurniture } from '../hooks/useAppFurniture';
import { useCategories } from '../hooks/useCategories';
import { AppDispatch } from '../store';
import { createFurniture, deleteFurniture, updateFurniture } from '../store/furnitureReducer';

import { Furniture } from 'um-types';

export function FurnitureWidget() {
  const furniture = useAppFurniture();
  const categories = useCategories();

  const dispatch = useDispatch<AppDispatch>();

  const onUpdate = useCallback(
    (f: Furniture) => {
      dispatch(updateFurniture(f));
    },
    [dispatch],
  );

  const onAdd = useCallback(() => {
    dispatch(createFurniture());
  }, [dispatch]);

  const onDelete = useCallback(
    (id: string) => {
      dispatch(deleteFurniture(id));
    },
    [dispatch],
  );

  const renderCategoryRefs = (row: Furniture) => {
    const next = { ...row };

    const isChecked = (categoryId: string) => {
      return row.categoryRefs?.some((c) => c.id == categoryId) || false;
    };

    const onChange = (checked: boolean, catId: string) => {
      if (checked) {
        const newCategory = categories.find((c) => c.id == catId);

        if (newCategory) {
          next.categoryRefs = [...(next.categoryRefs || []), newCategory];
        }
      } else {
        const newcats = next.categoryRefs.filter((c) => c.id != catId);
        if (newcats.length === 0) {
          alert('Mindestens eine Kategorie muss ausgewählt sein!');
          return;
        }
        next.categoryRefs = newcats;
      }
      dispatch(updateFurniture(next));
    };

    return (
      <FormGroup row>
        {categories.map((cat) => (
          <FormControlLabel
            key={cat.id}
            label={cat.name}
            control={
              <Checkbox
                checked={isChecked(cat.id)}
                onChange={(ev) => {
                  onChange(ev.target.checked, cat.id);
                }}
              />
            }
          />
        ))}
      </FormGroup>
    );
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID',
      },
      {
        field: 'name',
        headerName: 'Name',
        editable: true,
        width: 200,
      },
      {
        field: 'categoryRefs',
        headerName: 'Kategorien',
        flex: 1,
        renderCell: ({ row }) => renderCategoryRefs(row),
      },
      {
        field: 'volume',
        headerName: 'Volume',
        type: 'number',
        width: 70,
        editable: true,
      },
      {
        field: 'step',
        headerName: 'Schritt',
        type: 'number',
        width: 70,

        editable: true,
      },
      {
        field: 'sortOrder',
        type: 'number',
        editable: true,
        width: 80,

        headerName: 'Sortierung',
      },
    ];
  }, [categories]);

  return (
    <AppGridContainer>
      <Grid item xs={12}>
        <AppCard title="Möbel">
          <AddButton onClick={onAdd} />
          <AppDataGrid
            columns={columns}
            data={furniture}
            paginationMode="client"
            disablePagination
            allowDeletion
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </AppCard>
      </Grid>
    </AppGridContainer>
  );
}
