import ReactDOM from 'react-dom';
import { RemoveIcon } from '@threekit-tools/treble';
import { ModalProps } from '../../types';
import s from './Modal.module.scss';

function ModalComponent(props: ModalProps) {
  const { title, children, handleClose } = props;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={s.modalComponent_popup__inner}
    >
      <div>
        <h2>{title}</h2>
        <div onClick={handleClose} className="float-right cursor-pointer">
          <RemoveIcon />
        </div>
      </div>
      <div className={s.modal_content}>{children}</div>
    </div>
  );
}

export default function Modal(props: ModalProps) {
  const { title, children, handleClose, show } = props;
  if (!show) return null;
  return ReactDOM.createPortal(
    <div onClick={handleClose} className={s.modal_popup}>
      <div className={s.modal_popup__inner}>
        <ModalComponent title={title} handleClose={handleClose}>
          {children}
        </ModalComponent>
      </div>
    </div>,
    document.body
  );
}
