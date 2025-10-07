interface InchwormVariables {
  path: string;
  values: string;
}

export const Loader = () => {
  const inchwormVariables: InchwormVariables[] = [
    {
      path: "M4 10H2v1H1v2h1v1h2v-1h1v-2H4v-1ZM1 9h1v1H1Zm2 0h1v1H3Z",
      values: "0,0; 2,0; 4,0; 6,0; 7,0; 6,0; 4,0; 2,0; -1,0; 0,0",
    },
    {
      path: "M9 10H7v1H6v2h1v1h2v-1h1v-2H9v-1Z",
      values: "0,0; 2,0; 4,0; 6,0; 7,-1; 6,0; 4,0; 2,0; -1,0; 0,0",
    },
    {
      path: "M14 10h-2v1h-1v2h1v1h2v-1h1v-2h-1v-1Z",
      values: "0,0; 2,0; 2,-4; 2,-5; 1,-6; 2,-5; 2,-4; 2,0; 0,0; 0,0",
    },
    {
      path: "M19 10h-2v1h-1v2h1v1h2v-1h1v-2h-1v-1Z",
      values: "0,0; 0,-4; 0,-8; 0,-9; 0,-10; 0,-9; 0,-8; 0,-4; 0,0; 0,0",
    },
    {
      path: "M24 10h-2v1h-1v2h1v1h2v-1h1v-2h-1v-1Z",
      values: "0,0; -2,0; -2,-4; -2,-5; -1,-6; -2,-5; -2,-4; -2,0; 1,0; 0,0",
    },
    {
      path: "M29 10h-2v1h-1v2h1v1h2v-1h1v-2h-1v-1Z",
      values: "0,0; -2,0; -4,0; -6,0; -7,-1; -6,0; -4,0; -2,0; 1,0; 0,0",
    },
    {
      path: "M34 10h-2v1h-1v2h1v1h2v-1h1v-2h-1v-1Z",
      values: "0,0; -2,0; -4,0; -6,0; -7,0; -6,0; -4,0; -2,0; 1,0; 0,0",
    },
  ];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 14"
      fill="currentColor"
    >
      {inchwormVariables.map(({ path, values }, i) => {
        return (
          <g key={i}>
            <path d={path} />
            <animateTransform
              attributeName="transform"
              calcMode="discrete"
              dur="900ms"
              keyTimes="0;0.111;0.222;0.333;0.444;0.555;0.666;0.777;0.888;1"
              repeatCount="indefinite"
              type="translate"
              values={values}
            />
          </g>
        );
      })}
    </svg>
  );
};
