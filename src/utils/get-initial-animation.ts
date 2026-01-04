import { Direction } from "@/lib/types";

const getInitialAnimation = (
  index: number,
  direction: Direction,
  currentIndex: number,
  totalProjects: number,
) => {
  const position = (index - currentIndex + totalProjects) % totalProjects;

  if (direction === "left") {
    return position === 1
      ? { x: 100, opacity: 0 }
      : position === totalProjects - 1
        ? { x: -250, opacity: 0.7 }
        : { x: -100, opacity: 0 };
  } else {
    return position === totalProjects - 1
      ? { x: -100, opacity: 0 }
      : position === 1
        ? { x: 250, opacity: 0.7 }
        : { x: 100, opacity: 0 };
  }
};

export default getInitialAnimation;
