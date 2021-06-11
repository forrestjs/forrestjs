import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

export const LayoutDrawerList = ({ items }) => (
  <>
    <Divider />
    <List>
      {items.map((ListItem) => (
        <ListItem key={ListItem.name} />
      ))}
    </List>
  </>
);
