import Header from '../Header/Header';
import { LoagingPage } from '../LoagingPage/LoagingPage';
import { PlayerWidget } from '../PlayerWidget';
import s from './MainLayout.module.scss';
// import { ConfigurationSection } from '../ConfigurationSection';

export const MainLayout = () => {
  return (
    <div className={s.page}>
      <LoagingPage />
      <Header />
      <div className={s.mainLayoutContainer}>
        {/* <ConfigurationSection /> */}
        <PlayerWidget />
      </div>
    </div>
  );
};
