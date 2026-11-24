import Header from '../../components/header/header';
import css from './dashboard-page.module.css';

// Full layout (Navigation, Balance, Currency, tabs) comes in TASK-23 / TASK-29.
const DashboardPage = () => {
  return (
    <div className={css.page}>
      <Header />
    </div>
  );
};

export default DashboardPage;
