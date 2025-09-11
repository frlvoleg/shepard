import { useState } from 'react';
import logo from '../../assets/logo.svg';
import icon1 from '../../assets/icons/ri_headphone-fill.svg';
import icon2 from '../../assets/icons/ri_user-3-fill.svg';
import icon3 from '../../assets/icons/ri_heart-3-fill.svg';
import icon4 from '../../assets/icons/ri_shopping-cart-2-fill.svg';
import icon5 from '../../assets/icons/ri_logout-box-r-line.svg';
import s from './Header.module.scss';
import Modal from '../Modal/Modal';
import EventInformation from '../EventInformation/EventInformation';

interface MenuItemBase {
  label: string;
}

interface ModalItem extends MenuItemBase {
  type: 'modal';
  href?: string;
}

interface NavigationItem extends MenuItemBase {
  type: 'link';
  href: string;
}

type MenuItem = NavigationItem | ModalItem;

const topMenu = [
  { title: 'Contact Us', icon: icon1 },
  { title: 'Sarah Alvaz - Testing', icon: icon2 },
  { title: 'My list', icon: icon3 },
  { title: 'My cart', icon: icon4 },
  { title: 'Logout', icon: icon5 },
];

const bottomMenu: MenuItem[] = [
  { type: 'link', label: 'Home', href: '/' },
  { type: 'modal', label: 'Event Information', href: '#' },
  { type: 'link', label: 'Products', href: '/products' },
  { type: 'link', label: 'Services', href: '/services' },
  { type: 'link', label: 'Resources', href: '/resources' },
  {
    type: 'link',
    label: 'Third Party & EAC Resources',
    href: '/third-party-eac',
  },
  { type: 'link', label: 'Approvals', href: '/approvals' },
];

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.type === 'modal' && item.label === 'Event Information') {
      openModal('Create new booth', <EventInformation onClose={closeModal} />);
    } else if (item.type === 'link') {
      window.location.href = item.href;
    }
  };

  return (
    <header className={s.main_header}>
      <div className={s.header_top}>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className={s.header_top_menu}>
          <ul>
            {topMenu.map((i, index) => {
              return (
                <li key={index}>
                  <img src={i.icon} alt="menu icon" />
                  {i.title}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={s.header_bottom}>
        <div className={s.header_bottom_menu}>
          <ul>
            {bottomMenu.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className="menu_bottom_item"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                    font: 'inherit',
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        title={modalContent?.title || ''}
        handleClose={closeModal}
      >
        {modalContent?.content}
      </Modal>
    </header>
  );
};

export default Header;
