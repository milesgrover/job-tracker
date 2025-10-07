export const BasicLink = (props: React.ComponentPropsWithoutRef<"a">) => {
  const { className, children, ...rest } = props;
  const combineClass = () => {
    const classSet = new Set([
      "text-yellow-300",
      "underline",
      "hover:no-underline",
    ]);
    if (className) {
      className.split(" ").forEach((c) => classSet.add(c));
    }
    return Array.from(classSet).join(" ");
  };
  return (
    <a className={combineClass()} {...rest}>
      {children}
    </a>
  );
};
