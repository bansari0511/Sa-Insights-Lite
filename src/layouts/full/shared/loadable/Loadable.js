import React, { Suspense } from "react";

const Loadable = (Component) => (props) =>
(
  <Suspense fallback={<div />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
