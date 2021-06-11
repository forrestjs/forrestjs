import ListItem from '@material-ui/core/ListItem';
import { Link } from 'react-router-dom';

export const ListItemLink = (props) => (
  <ListItem button component={Link} {...props} />
);
