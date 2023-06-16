export const drop_down = {
  hidden: {
    opacity: 0,
    scale: 0.2,
  },
  show: {
    opacity: 1,
    scale: 1.2,
  },
  removed: {
    scale: 0.8,
  },
};
export const animate_translateY = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  show: {
    opacity: 1,
    y: 0,
  },
  removed: {
    opacity: 0,
    y: -50,
  },
};
export const animate_translateY_reverse = {
  hidden: {
    opacity: 0,
    y: 50,
    staggerChildren: 0.1,
    delayChildren: 0.1,
  },
  show: {
    opacity: 1,
    y: 0,
  },
  removed: {
    opacity: 0,
  },
};
export const fadeIn_out = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
  removed: {
    opacity: 0,
  },
};
export const fadeInd_Right = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  show: {
    opacity: 1,
    x: 0,
  },
  removed: {
    opacity: 0,
  },
};
