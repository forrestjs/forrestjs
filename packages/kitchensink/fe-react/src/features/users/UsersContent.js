import ButtonLink from '../../components/ButtonLink';
import PageContent from '../../components/PageContent';
import PageItem from '../../components/PageItem';

export const UsersContent = () => (
  <PageContent>
    <PageItem>
      <h4>Users</h4>
      <p>
        <ButtonLink color="primary" to="/">
          Home
        </ButtonLink>
      </p>
    </PageItem>
  </PageContent>
);
