import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export const ButtonLink = (props) => <Button component={Link} {...props} />;
