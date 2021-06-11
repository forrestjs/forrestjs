import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ListItemLink from '../../components/ListItemLink';

export const InvoicesMenuItems = () => (
  <ListItemLink to="/invoices">
    <ListItemIcon>
      <ReceiptIcon />
    </ListItemIcon>
    <ListItemText primary="Invoices" />
  </ListItemLink>
);
