import { useForm } from '@mantine/form';
import {
	Paper,
	PaperProps,
	Image,
	Text,
	Container,
	createStyles,
	Center,
	LoadingOverlay,
	TextInput,
	Button,
	PinInput,
} from '@mantine/core';
import { memo, useCallback } from 'react';
import { IconMail } from '@tabler/icons-react';
import useRequest from '../hooks/useRequest';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const useStyles = createStyles(() => ({
	root: {
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
	},
}));

export default memo((props: PaperProps) => {
	const {
		classes: { root },
	} = useStyles();

	const request = useRequest();
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.auth.user);

	const form = useForm({
		initialValues: {
			email: user?.email || '',
			password: '',
			passwordConfirm: '',
			otp: '',
		},
		validate: {
			email: (val: string) => (!val ? 'Please enter email' : null),
			otp: (val: string) => (val.length !== 6 ? 'OTP must be 6 characters' : null),
			password: (val: string) => (!val ? 'Please enter email' : null),
			passwordConfirm: (val: string) =>
				val.length !== 6 ? 'OTP must be 6 characters' : null,
		},
	});

	const requestOTP = useCallback(async () => {
		await request.post(`/request-otp`, {
			email: form.values.email || user?.email,
		});
	}, [form.values.email]);

	const passwordReset = useCallback(async () => {
		const res = await request.post(`/password-reset`, {
			otp: form.values.otp,
			email: form.values.email,
			password: form.values.password,
			passwordConfirm: form.values.passwordConfirm,
		});
		if (res.data?.status !== 200) {
			navigate(ROUTES.AUTH);
		}
	}, [form.values.otp, form.values.email, form.values.password, form.values.passwordConfirm]);

	return (
		<>
			<LoadingOverlay
				visible={false}
				zIndex={9999}
			/>
			<Container
				className={root}
				size="xl"
			>
				<Paper
					withBorder
					mt="xl"
					p="xl"
					{...props}
				>
					<Center>
						<Image
							src="/Logo.png"
							width={100}
						/>
					</Center>

					<Text
						c="dimmed"
						fz={'lg'}
						ta="center"
						mt="md"
					>
						Please enter your email to receive a
					</Text>
					<Text
						c="dimmed"
						fz={'lg'}
						ta="center"
					>
						One Time Password
					</Text>

					<TextInput
						name="email"
						value={form.values.email}
						label="Email"
						type="email"
						onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
						placeholder="Enter email"
					/>
					<Button
						my="sm"
						variant="light"
						fullWidth
						onClick={requestOTP}
						leftIcon={<IconMail />}
						radius="md"
					>
						Get OTP
					</Button>
					<Center>
						<PinInput
							value={form.values.otp}
							onChange={(value) => form.setFieldValue('otp', value)}
							autoFocus
							size="xl"
							length={6}
							oneTimeCode
						/>
					</Center>
					<TextInput
						name="password"
						value={form.values.password}
						label="Password"
						type="password"
						onChange={(event) =>
							form.setFieldValue('password', event.currentTarget.value)
						}
						placeholder="Enter password"
					/>
					<TextInput
						name="passwordConfirm"
						value={form.values.passwordConfirm}
						label="Confirm Password"
						type="password"
						onChange={(event) =>
							form.setFieldValue('passwordConfirm', event.currentTarget.value)
						}
						placeholder="Confirm Password"
					/>
					<Button
						onClick={passwordReset}
						mt="xl"
						radius="md"
						fullWidth
					>
						Reset Password
					</Button>
					<Center mt="xs">
						<Link to={ROUTES.AUTH}>Signin instead</Link>
					</Center>
				</Paper>
			</Container>
		</>
	);
});
