import { useForm } from '@mantine/form';
import {
	Button,
	Center,
	Container,
	createStyles,
	Flex,
	Image,
	LoadingOverlay,
	Paper,
	PaperProps,
	Stack,
	TextInput,
	ThemeIcon,
	Title,
	Text,
} from '@mantine/core';
import { IconLock, IconMail } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import useRequest from '../hooks/useRequest';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Auth, signin } from '../app/slices/auth';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { customLoader } from '../components/CustomLoader';
import { notifications } from '@mantine/notifications';

const useStyles = createStyles(() => ({
	root: {
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
	},
}));

export default React.memo((props: PaperProps) => {
	const {
		classes: { root },
	} = useStyles();
	const request = useRequest();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const form = useForm({
		initialValues: {
			username: '',
			password: '',
		},

		validate: {
			username: (val: string) => (val.length > 0 ? null : 'Email or username is required'),
			password: (val: string | any[]) =>
				val.length <= 6 ? 'Password should include at least 6 characters' : null,
		},
	});

	const mutation = useMutation({
		mutationFn: () => request.post('/login', form.values),
		onSuccess: (res: AxiosResponse) => {
			if (res.data.status === 401) return null;

			dispatch(signin(res.data as unknown as Auth));
			navigate('/');
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				title: 'FAILURE',
				message: JSON.stringify(error.response?.data),
				color: 'red',
			});
		},
	});

	return (
		<Container
			className={root}
			size="xs"
		>
			<LoadingOverlay
				visible={mutation.isLoading}
				loader={customLoader}
				zIndex={1000}
			/>
			<Paper
				mt="xl"
				withBorder
				shadow="lg"
				p="xl"
				{...props}
				w={'100%'}
				sx={{ background: 'transparent' }}
			>
				<Flex
					align={'center'}
					justify={'center'}
					gap="md"
				>
					<Image
						src="/Logo.png"
						width={80}
					/>
				</Flex>

				<Center>
					<Title
						c="dimmed"
						fz={'xl'}
						my="md"
					>
						Signin
					</Title>
				</Center>

				<form onSubmit={form.onSubmit(() => mutation.mutate())}>
					<Stack>
						<TextInput
							label="Email or username"
							icon={
								<ThemeIcon
									color="transparent"
									size="sm"
								>
									<IconMail color="gray" />
								</ThemeIcon>
							}
							placeholder="Email or username"
							value={form.values.username}
							onChange={(event) =>
								form.setFieldValue('username', event.currentTarget.value)
							}
							error={form.errors.username}
						/>

						<TextInput
							value={form.values.password}
							onChange={(event) =>
								form.setFieldValue('password', event.currentTarget.value)
							}
							placeholder="Password"
							label="Password"
							type="password"
							mb="xs"
							icon={
								<ThemeIcon
									color="transparent"
									size="sm"
								>
									<IconLock color="gray" />
								</ThemeIcon>
							}
							error={form.errors.password}
						/>
						<Text
							mt={-20}
							component={RouterLink}
							to={ROUTES.PASSWORD_RESET}
						>
							Reset Password
						</Text>
						<Button
							type="submit"
							radius="md"
						>
							Sign In
						</Button>
					</Stack>
				</form>
			</Paper>
		</Container>
	);
});
