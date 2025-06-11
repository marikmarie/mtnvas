import {
	Button,
	Center,
	Container,
	createStyles,
	LoadingOverlay,
	Paper,
	PaperProps,
	PinInput,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

export default memo((props: PaperProps) => {
	const {
		classes: { root, formContainer },
		cx,
	} = useStyles();

	const request = useRequest();

	const form = useForm({
		initialValues: {
			msisdn: '',
			otp: '',
			password: '',
			passwordConfirm: '',
		},
		validate: {
			msisdn: (value) => {
				if (!value) return 'Phone number is required';
				if (!/^256\d{9}$/.test(value))
					return 'Phone number must start with 256 followed by 9 digits';
				return null;
			},
			otp: (value) => (value.length !== 6 ? 'OTP must be 6 characters' : null),
			password: (value) => (!value ? 'Password is required' : null),
			passwordConfirm: (value): string | null =>
				value !== form.values.password ? 'Passwords do not match' : null,
		},
	});

	const requestOTPMutation = useMutation({
		mutationFn: () => request.post(`/request-otp?msisdn=${form.values.msisdn}`),
	});

	const passwordResetMutation = useMutation({
		mutationFn: () =>
			request.post('/password-reset', {
				otp: form.values.otp,
				msisdn: form.values.msisdn,
				password: form.values.password,
				passwordConfirm: form.values.passwordConfirm,
			}),
	});

	const requestOTP = useCallback(() => {
		if (form.validateField('msisdn').hasError) return;
		requestOTPMutation.mutate();
	}, [form.values.msisdn]);

	const handlePasswordReset = useCallback(() => {
		if (form.validate().hasErrors) return;
		passwordResetMutation.mutate();
	}, [form.values]);

	return (
		<>
			<LoadingOverlay
				visible={requestOTPMutation.isLoading || passwordResetMutation.isLoading}
				zIndex={9999}
			/>
			<Container
				className={root}
				size="xl"
			>
				<Paper
					className={cx(formContainer, props.className)}
					p="xl"
					{...props}
					w={450}
				>
					<Text
						c="dimmed"
						size="sm"
						align="center"
						mb="lg"
					>
						Enter your phone number to receive an OTP, then set your new password.
					</Text>

					<Stack spacing="sm">
						<TextInput
							name="msisdn"
							value={form.values.msisdn}
							label="Phone Number"
							onChange={(event) =>
								form.setFieldValue('msisdn', event.currentTarget.value)
							}
							placeholder="Enter phone number (e.g., 256123456789)"
							error={form.errors.msisdn}
						/>
						<Button
							my="sm"
							variant="light"
							fullWidth
							onClick={requestOTP}
							leftIcon={<IconMail size="1rem" />}
							radius="md"
							mt="xs"
							loading={requestOTPMutation.isLoading}
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
								error={!!form.errors.otp}
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
							error={form.errors.password}
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
							error={form.errors.passwordConfirm}
						/>
						<Button
							type="submit"
							onClick={handlePasswordReset}
							mt="md"
							radius="md"
							fullWidth
							loading={passwordResetMutation.isLoading}
						>
							Re/set Password
						</Button>
					</Stack>
					<Center mt="xs">
						<Link to={'/signin'}>Signin instead</Link>
					</Center>
				</Paper>
			</Container>
		</>
	);
});
