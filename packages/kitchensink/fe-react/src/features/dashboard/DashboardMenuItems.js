import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppsIcon from '@material-ui/icons/Apps';
import ListItemLink from '../../components/ListItemLink';

export const DashboardMenuItems = () => (
  <ListItemLink to="/">
    <ListItemIcon>
      <AppsIcon />
    </ListItemIcon>
    <ListItemText primary="dashboard" />
  </ListItemLink>
);
