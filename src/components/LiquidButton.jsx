import React from 'react';
import './LiquidButton.css';

/* -----------------------------------------------------------------------------
 * Liquid-glass button
 * Port of the "liquid glass" button: a transparent pill with a glassy rim
 * (layered inset shadows) and an SVG turbulence/displacement backdrop filter.
 * On browsers without backdrop-filter:url() support it degrades gracefully to
 * the rim treatment alone. Renders as <button> by default, or any element via
 * the `as` prop (e.g. as="a" for links).
 * -------------------------------------------------------------------------- */

function GlassFilter() {
  return (
    <svg className="liquid-glass-defs" aria-hidden="true" width="0" height="0">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export default function LiquidButton({ as = 'button', className = '', children, ...props }) {
  const Comp = as;
  return (
    <Comp className={`liquid-btn ${className}`} {...props}>
      <span className="liquid-btn-rim" aria-hidden="true" />
      <span className="liquid-btn-glass" aria-hidden="true" />
      <span className="liquid-btn-content">{children}</span>
      <GlassFilter />
    </Comp>
  );
}
