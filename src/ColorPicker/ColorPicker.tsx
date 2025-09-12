// ColorPicker.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import s from './ColorPicker.module.scss';

type RGB = { r: number; g: number; b: number };
type HSV = { h: number; s: number; v: number };

function rgbToHsv({ r, g, b }: RGB): HSV {
  const r1 = r / 255,
    g1 = g / 255,
    b1 = b / 255;
  const max = Math.max(r1, g1, b1),
    min = Math.min(r1, g1, b1);
  const d = max - min;
  let h = 0;
  if (d) {
    switch (max) {
      case r1:
        h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
        break;
      case g1:
        h = (b1 - r1) / d + 2;
        break;
      default:
        h = (r1 - g1) / d + 4;
    }
    h *= 60;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
}
function hsvToRgb({ h, s, v }: HSV): RGB {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (0 <= h && h < 60) [r1, g1, b1] = [c, x, 0];
  else if (60 <= h && h < 120) [r1, g1, b1] = [x, c, 0];
  else if (120 <= h && h < 180) [r1, g1, b1] = [0, c, x];
  else if (180 <= h && h < 240) [r1, g1, b1] = [0, x, c];
  else if (240 <= h && h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}
export const rgbToHex = (c: RGB) =>
  `#${[c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;

type Props = {
  value: RGB; // поточний колір
  onChange: (rgb: RGB) => void;
  width?: number; // ширина SV-площі
  height?: number; // висота SV-площі
  className?: string;
};

export default function ColorPicker({
  value,
  onChange,
  width = 360,
  height = 200,
  className,
}: Props) {
  const [hsv, setHsv] = useState<HSV>(() => rgbToHsv(value));

  // синхронізуємо зовнішнє value → внутрішній hsv
  useEffect(() => setHsv(rgbToHsv(value)), [value.r, value.g, value.b]);

  const svRef = useRef<HTMLCanvasElement | null>(null);
  const hueRef = useRef<HTMLInputElement | null>(null);

  // фоновий колір для SV-площі = pure hue
  const hueRgb = useMemo(() => hsvToRgb({ h: hsv.h, s: 1, v: 1 }), [hsv.h]);

  // промальовка SV-квадрата
  useEffect(() => {
    const canvas = svRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // 1) градієнт по осі X (білий → чистий hue)
    ctx.clearRect(0, 0, width, height);
    const sat = ctx.createLinearGradient(0, 0, width, 0);
    sat.addColorStop(0, 'rgba(255,255,255,1)');
    sat.addColorStop(1, `rgb(${hueRgb.r},${hueRgb.g},${hueRgb.b})`);
    ctx.fillStyle = sat;
    ctx.fillRect(0, 0, width, height);

    // 2) градієнт по осі Y (прозорий → чорний)
    const val = ctx.createLinearGradient(0, 0, 0, height);
    val.addColorStop(0, 'rgba(0,0,0,0)');
    val.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = val;
    ctx.fillRect(0, 0, width, height);
  }, [hueRgb, width, height]);

  const setSVFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = svRef.current!.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as any).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as any).clientY;
    let x = clientX - rect.left;
    let y = clientY - rect.top;
    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));
    const s = x / rect.width;
    const v = 1 - y / rect.height;
    const next = { ...hsv, s, v };
    setHsv(next);
    onChange(hsvToRgb(next));
  };

  const onSVMouseDown = (e: React.MouseEvent) => {
    setSVFromEvent(e);
    const onMove = (ev: MouseEvent) => setSVFromEvent(ev as any);
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onSVTouchStart = (e: React.TouchEvent) => {
    setSVFromEvent(e);
    const onMove = (ev: TouchEvent) => setSVFromEvent(ev as any);
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
  };

  const handleHue = (h: number) => {
    const next = { ...hsv, h };
    setHsv(next);
    onChange(hsvToRgb(next));
  };

  // позиція курсора в SV
  const svX = Math.round(hsv.s * width);
  const svY = Math.round((1 - hsv.v) * height);

  return (
    <div className={`${s['cmp-color-picker']} ${className ?? ''}`}>
      <div className={s['sv-wrap']} style={{ width, height }}>
        <canvas
          ref={svRef}
          className={s['sv-canvas']}
          onMouseDown={onSVMouseDown}
          onTouchStart={onSVTouchStart}
        />
        <div
          className={s['sv-cursor']}
          style={{ left: svX, top: svY, borderColor: rgbToHex(hueRgb) }}
        />
      </div>

      <div className={s['hue-wrap']}>
        <input
          ref={hueRef}
          type="range"
          min={0}
          max={360}
          value={Math.round(hsv.h)}
          onChange={(e) => handleHue(Number(e.target.value))}
          className={s['hue-input']}
        />
      </div>
    </div>
  );
}
