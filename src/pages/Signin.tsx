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
	Text,
	TextInput,
	ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconMail } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Auth, signin } from '../app/slices/auth';
import { customLoader } from '../components/CustomLoader';
import useRequest from '../hooks/useRequest';

const useStyles = createStyles((theme) => ({
	root: {
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
	},
	formContainer: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		borderRadius: theme.radius.lg,
		boxShadow: theme.shadows.lg,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
		}`,
	},
}));

export default React.memo((props: PaperProps) => {
	const {
		classes: { root, formContainer },
		cx,
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
			dispatch(signin(res.data as unknown as Auth));
			navigate('/');
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
				className={cx(formContainer, props.className)}
				p="xl"
				w={400}
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
					<Text
						c="dimmed"
						size="sm"
						align="center"
						my="sm"
					>
						Welcome back! Please enter your credentials.
					</Text>
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
						<Link to={'/passwordReset'}>Re/Set Password</Link>
						<Button
							type="submit"
							radius="md"
							fullWidth
							loading={mutation.isLoading}
						>
							Sign In
						</Button>
					</Stack>
				</form>
			</Paper>
		</Container>
	);
});
