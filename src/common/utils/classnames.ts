export const classnames = (classes: (string | undefined)[]) =>
  classes.filter((item) => Boolean(item)).join(' ');