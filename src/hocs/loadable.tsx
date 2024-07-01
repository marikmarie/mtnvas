import { Flex } from '@mantine/core';
import React, { Suspense } from 'react';
import '../loader.css';
import { customLoader } from '../components/CustomLoader';

export const Loadable = <P extends object>(WrappedComponent: React.FunctionComponent<P>) => {
	const Component: React.FC<P> = (props) => {
		return (
			<Suspense
				fallback={
					<Flex
						align="center"
						justify="center"
						h="100vh"
					>
						{customLoader}
					</Flex>
				}
			>
				<WrappedComponent {...props} />
			</Suspense>
		);
	};
	return Component;
};
