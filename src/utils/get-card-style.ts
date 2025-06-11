const getCardStyle = (
  index: number,
  currentIndex: number,
  totalProjects: number,
) => {
  const position = (index - currentIndex + totalProjects) % totalProjects;

  switch (position) {
    case 0:
      return { x: 0, y: -20, scale: 1, opacity: 1, zIndex: 30 };
    case 1:
      return { x: 200, scale: 0.9, opacity: 0.5, zIndex: 20 };
    case totalProjects - 1:
      return { x: -200, scale: 0.9, opacity: 0.5, zIndex: 20 };
    default:
      return null;
  }
};

export default getCardStyle;
