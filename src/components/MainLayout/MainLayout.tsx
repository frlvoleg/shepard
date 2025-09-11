import Header from '../Header/Header';
import { PlayerWidget } from '../PlayerWidget';
import s from './MainLayout.module.scss';
// import { ConfigurationSection } from '../ConfigurationSection';
// import { LoagingPage } from '../LoagingPage/LoagingPage';

export const MainLayout = () => {
  return (
    <div className={s.page}>
      <Header />
      <div className={s.mainLayoutContainer}>
        {/* <ConfigurationSection /> */}
        <PlayerWidget />
      </div>
      {/* <LoagingPage /> */}
    </div>
  );
};
