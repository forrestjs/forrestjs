import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import ListItemLink from '../../components/ListItemLink';

export const UsersMenuItems = () => (
  <ListItemLink to="/users">
    <ListItemIcon>
      <PeopleIcon />
    </ListItemIcon>
    <ListItemText primary="Users" />
  </ListItemLink>
);
