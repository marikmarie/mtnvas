import React, { lazy } from 'react';
import { createStyles, Paper, Text, Title, Center, Image, Stack } from '@mantine/core';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Loadable } from '../hocs/Loadable';

const StarterPack = Loadable(lazy(() => import('../modules/5GStarterPack')));

const useStyles = createStyles((theme) => ({
	root: {
		position: 'static',
		zIndex: 9,
	},
	paper: {
		padding: 40,
	},
	title: {
		marginBottom: theme.spacing.lg,
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
	},
	subtitle: {
		marginBottom: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7],
	},
}));

const Dashboard: React.FC = () => {
	const { classes } = useStyles();
	const user = useSelector((state: RootState) => state.auth.user);
	const displayName = user?.email?.split('@')[0] || 'Wakanet user';

	return (
		<Layout>
			<Paper className={classes.paper}>
				<Center>
					<Stack
						align="center"
						spacing="lg"
					>
						<Image
							src="/Logo.png"
							width={120}
						/>
						<Title
							order={1}
							className={classes.title}
						>
							Welcome to the 4G | 5G Portal
						</Title>
						<Text
							size="lg"
							className={classes.subtitle}
						>
							Hello {displayName}, use the navigation menu to access portal features.
						</Text>
					</Stack>
				</Center>
				<StarterPack />
			</Paper>
		</Layout>
	);
};

export default React.memo(withAuth(Dashboard));
