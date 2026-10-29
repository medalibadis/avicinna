'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}
