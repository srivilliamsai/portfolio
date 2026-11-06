import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
export default function Reveal({ children, className = '', delay = 0, y = 6 }) {
  const reduceMotion = useReducedMotion();
  const hidden = { opacity: 0, y, filter: 'blur(10px)' };
  const visible = { opacity: 1, y: 0, filter: 'blur(0px)' };
  return <motion.div className={className} initial={reduceMotion ? false : hidden}
    whileInView={visible}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : delay, ease: [.2,.7,.2,1] }}>{children}</motion.div>;
}
