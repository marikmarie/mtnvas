import { Flex, Loader } from "@mantine/core";
import React, { Suspense } from "react";
import "../loader.css";

export const PrivateLoader = <P extends object>(
  WrappedComponent: React.FunctionComponent<P>,
) => {
  const Component: React.FC<P> = ( props ) => {
    return (
      <Suspense
        fallback={
          <Flex align="center" justify="center" h="100vh">
            <Loader variant={"oval"} />
          </Flex>
        }
      >
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
  return Component;
};

export const PublicLoader = <P extends object>(
  WrappedComponent: React.FunctionComponent<P>,
) => {
  const Component: React.FC<P> = ( props ) => {
    return (
      <Suspense
        fallback={
          <Flex align="center" justify="center" h="100vh">
            <Loader variant={"oval"} />
          </Flex>
        }
      >
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
  return Component;
};
