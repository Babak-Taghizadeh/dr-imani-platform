interface StaggeredAnimationProps {
  index?: number;
  delayMultiplier?: number;
  yOffset?: number;
  duration?: number;
}

export const createStaggeredAnimation = ({
  index = 0,
  delayMultiplier = 0.3,
  yOffset = 60,
  duration = 0.5,
}: StaggeredAnimationProps = {}) => ({
  initial: { opacity: 0, y: yOffset },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay: index * delayMultiplier },
});

export const createViewportAnimation = ({
  yOffset = 60,
  duration = 0.6,
  margin = "-30px",
}: {
  yOffset?: number;
  duration?: number;
  margin?: string;
} = {}) => ({
  initial: { opacity: 0, y: yOffset },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin },
  transition: { duration },
});

export const createStaggeredViewportAnimation = ({
  index = 0,
  delayMultiplier = 0.3,
  yOffset = 60,
  duration = 0.6,
}: {
  index?: number;
  delayMultiplier?: number;
  yOffset?: number;
  duration?: number;
} = {}) => ({
  initial: { opacity: 0, y: yOffset },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration, delay: index * delayMultiplier },
});
