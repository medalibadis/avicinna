'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

/**
 * ModalPortal: Teleports modal dialogs directly into document.body.
 * 
 * Solves the CSS transform/filter containing block issue where position: fixed
 * gets trapped inside animated parent containers (e.g. Framer Motion <motion.div>).
 * Guarantees that modals are strictly viewport-relative (100vw x 100vh),
 * perfectly centered, completely blur the real background without black effect,
 * and lock body scrolling while open.
 */
export function ModalPortal({ isOpen, children }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    // Lock body scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(children, document.body);
}
