interface IconForUrlProps {
  url: string;
}

export const IconForUrl: React.FC<IconForUrlProps> = ({ url }) => {
  return (
    <a href={url} title={url}>
      {"\u2192"}
    </a>
  );
};
