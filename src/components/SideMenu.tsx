import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from '@mui/material';

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Version } from './Version';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ onClose, open }: Props) {
  const theme = useTheme();

  return (
    <Drawer
      PaperProps={{
        sx: {
          background: theme.palette.background.default,
        },
      }}
      open={open}
      onClose={onClose}
    >
      <Box p={3} display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" height="100%">
        <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
          <Version />

          <List>
            <DrawerItem onClose={onClose} to="/edit/-1" primaryText="Neuer Auftrag">
              <ModeEditOutlineOutlinedIcon />
            </DrawerItem>
            <DrawerItem onClose={onClose} primaryText="Alle Aufträge" to="/">
              <FormatListNumberedOutlinedIcon />
            </DrawerItem>

            <DrawerItem onClose={onClose} to="/import" primaryText="Auftrag importieren">
              <ImportExportOutlinedIcon />
            </DrawerItem>
            <Box mt={1} mb={1}>
              <Divider />
            </Box>
            <DrawerItem onClose={onClose} to="/settings" primaryText="Einstellungen">
              <SettingsOutlinedIcon />
            </DrawerItem>
            <Box mt={1} mb={1}>
              <Divider />
            </Box>
            <DrawerItem onClose={onClose} to="/blanco" primaryText="Neue Rechnung">
              <ReceiptLongOutlinedIcon />
            </DrawerItem>
          </List>
        </Box>
        <Box id="bottom-sidebar">
          <Box display="flex" justifyContent="center">
            <Tooltip title="Abmelden">
              <Link href={`${process.env.REACT_APP_WP_HOST}/wp-login.php?action=logout`}>
                <IconButton>
                  <LogoutOutlinedIcon />
                </IconButton>
              </Link>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

interface DrawerItemProps {
  to: string;
  primaryText: string;
  onClose: () => void;
}

function DrawerItem({ to, primaryText, onClose, children }: React.PropsWithChildren<DrawerItemProps>) {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(to);
    onClose();
  }, [navigate, to, onClose]);

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{children}</ListItemIcon>
        <ListItemText primary={primaryText} />
      </ListItemButton>
    </ListItem>
  );
}
