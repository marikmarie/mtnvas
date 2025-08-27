import React, { Component, ReactNode } from 'react';
import { Alert, Button, Container, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<Container size="md" py="xl">
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Something went wrong"
						color="red"
						variant="filled"
						mb="md"
					>
						<Text mb="md">
							An error occurred while rendering this component. Please try refreshing the page or contact support if the problem persists.
						</Text>
						{this.state.error && (
							<Text size="sm" color="dimmed" mb="md">
								Error: {this.state.error.message}
							</Text>
						)}
						<Button
							onClick={() => window.location.reload()}
							variant="light"
							color="red"
						>
							Refresh Page
						</Button>
					</Alert>
				</Container>
			);
		}

		return this.props.children;
	}
}
