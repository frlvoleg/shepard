import { createRoot } from 'react-dom/client';
import { AppDispatch } from '../store/rootReducer';
import {} from '../store/slices/ui/uiSlice';
import React from 'react';
import AddInfo from '../assets/svg/AddInfo';

// Интерфейс «сырых» аннотаций из onAnnotationChange
export interface RawAnnotation {
  id: string;
  visible: boolean;
  width: number;
  height: number;
  image: any;
  alpha: number;
  top: number;
  left: number;
  open: boolean;
  text: string;
  playerWidth: number;
  playerHeight: number;
}

export class AnnotationService {
  private wrapperId = 'annotations-wrapper';
  private currentOpen: RawAnnotation | null = null;

  constructor(private dispatch: AppDispatch) {}

  // Основной метод для подключения к плееру
  public onAnnotationChange = (
    annotations: RawAnnotation[],
    parentEl: HTMLElement | null
  ) => {
    if (!parentEl) return;
    let wrapper = parentEl.querySelector<HTMLElement>('#' + this.wrapperId);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = this.wrapperId;
      Object.assign(wrapper.style, {
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
      });
      parentEl.appendChild(wrapper);
    }
    // Чистим предыдущие точки
    wrapper.innerHTML = '';

    // Рисуем каждую видимую точку
    annotations.forEach((ann) => {
      if (!ann.visible) return;
      this.drawPoint(ann, wrapper!);
    });

    // Если тултип открыт — обновляем позицию
    if (this.currentOpen) {
      const match = annotations.find((a) => a.id === this.currentOpen!.id);
      if (match) {
        // this.dispatch(
        //   updateTooltipPosition({
        //     text: match.text,
        //     left: match.left,
        //     top: match.top,
        //   })
        // );
      }
    }
  };

  private drawPoint(ann: RawAnnotation, wrapper: HTMLElement) {
    const el = document.createElement('div');
    el.id = ann.id;
    Object.assign(el.style, {
      position: 'absolute',
      left: `${ann.left}px`,
      top: `${ann.top}px`,
      opacity: ann.alpha.toString(),
      pointerEvents: 'auto',
      cursor: 'pointer',
    });
    el.addEventListener('click', () => this.onPointClick(ann));
    wrapper.appendChild(el);

    // Если есть картинка — вставляем <img>, иначе рендерим SVG
    if (ann.image && (ann.image as any).url) {
      const img = document.createElement('img');
      img.src = (ann.image as any).url;
      el.appendChild(img);
    } else {
      createRoot(el).render(React.createElement(AddInfo));
    }
  }

  private onPointClick(ann: RawAnnotation) {
    // Закрываем, если клик по уже открытому
    if (this.currentOpen?.id === ann.id) {
      this.currentOpen = null;
      // this.dispatch(clearTooltip());
      return;
    }
    // Иначе открываем новый
    this.currentOpen = ann;
    // dispatch only serializable data: text, position, and imageSrc (string)
    const imageSrc = (ann.image as any)?.currentSrc || '';
    this
      .dispatch
      // setTooltip({
      //   text: ann.text,
      //   type: '',
      //   left: ann.left,
      //   top: ann.top,
      //   imageSrc,
      // })
      ();
  }
}
