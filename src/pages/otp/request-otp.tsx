import { useForm } from '@mantine/form'
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
} from '@mantine/core'
import { memo, useCallback } from 'react'
import { IconMail } from '@tabler/icons-react'
import useRequest from '../../hooks/use-request'

const useStyles = createStyles(() => ({
	root: {
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
	},
}))

export default memo((props: PaperProps) => {
	const {
		classes: { root },
	} = useStyles()

	const request = useRequest()

	const form = useForm({
		initialValues: {
			email: '',
			password: '',
			passwordConfirm: '',
			otp: '',
		},
		validate: {
			email: (val: string) => (!val ? 'Please enter email' : null),
			otp: (val: string) => (val.length !== 6 ? 'OTP must be 6 characters' : null),
			password: (val: string) => (!val ? 'Please enter email' : null),
			passwordConfirm: (val: string) => (val.length !== 6 ? 'OTP must be 6 characters' : null),
		},
	})

	const requestOTP = useCallback(async () => {
		await request.post(`/request-otp`, {
			email: form.values.email,
		})
	}, [form.values.email])

	const passwordReset = useCallback(async () => {
		await request.post(`/password-reset`, {
			otp: form.values.otp,
			email: form.values.email,
			password: form.values.password,
			passwordConfirm: form.values.passwordConfirm,
		})
	}, [form.values.otp, form.values.email])

	return (
		<>
			<LoadingOverlay visible={false} zIndex={9999} />
			<Container className={root} size="xl">
				<Paper withBorder mt="xl" p="xl" {...props}>
					<Center>
						<Image src="/Logo.png" width={100} />
					</Center>

					<Center>
						<Text c="dimmed" fz={'lg'} my="md">
							Please enter your email to receive an OTP
						</Text>
					</Center>

					<TextInput
						name="email"
						value={form.values.email}
						label="Email"
						type="email"
						onChange={event => form.setFieldValue('email', event.currentTarget.value)}
						placeholder="Enter email"
					/>
					<Button my="sm" variant="light" fullWidth onClick={requestOTP} leftIcon={<IconMail />}>
						Get OTP
					</Button>
					<Center>
						<PinInput
							value={form.values.otp}
							onChange={value => form.setFieldValue('otp', value)}
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
						onChange={event => form.setFieldValue('password', event.currentTarget.value)}
						placeholder="Enter password"
					/>
					<TextInput
						name="passwordConfirm"
						value={form.values.passwordConfirm}
						label="Confirm Password"
						type="password"
						onChange={event => form.setFieldValue('passwordConfirm', event.currentTarget.value)}
						placeholder="Confirm Password"
					/>
					<Button onClick={passwordReset} mt="xl" fullWidth>
						Reset Password
					</Button>
				</Paper>
			</Container>
		</>
	)
})
