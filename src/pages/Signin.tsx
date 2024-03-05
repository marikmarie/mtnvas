import { useForm } from '@mantine/form'
import {
	Box,
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
} from '@mantine/core'
import { IconAt, IconLock } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import useRequest from '../hooks/use-request'
import { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Auth, signin } from '../app/slices/auth'
import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const useStyles = createStyles(() => ({
	root: {
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
	},
}))

export default React.memo((props: PaperProps) => {
	const {
		classes: { root },
	} = useStyles()
	const request = useRequest(false)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const form = useForm({
		initialValues: {
			username: '',
			password: '',
		},

		validate: {
			username: (val: string) =>
				/^\S+@gdexperts\.com$/.test(val) || /^\S+@mtn\.com$/.test(val)
					? null
					: 'Should be a valid MTN or GDExperts EMAIL',
			password: (val: string | any[]) =>
				val.length <= 6 ? 'Password should include at least 6 characters' : null,
		},
	})

	const mutation = useMutation({
		mutationFn: () => request.post('/login', form.values),
		onSuccess: (res: AxiosResponse) => {
			console.log('auth: ', res.data)
			dispatch(signin(res.data as unknown as Auth))
			navigate('/dashboard')
		},
	})

	return (
		<Container className={root} size="xs">
			<LoadingOverlay visible={mutation.isLoading} zIndex={1000} />
			<Paper mt="xl" withBorder p="xl" {...props} w={'100%'} sx={{ background: 'transparent' }}>
				<Flex align={'center'} justify={'center'} gap="md">
					<Image src="/Logo.png" width={80} />
				</Flex>

				<Center>
					<Title c="dimmed" fz={'xl'} my="md">
						Signin
					</Title>
				</Center>

				<form>
					<Stack>
						<TextInput
							label="Email"
							icon={
								<ThemeIcon color="transparent" size="sm">
									<IconAt color="gray" />
								</ThemeIcon>
							}
							placeholder="mail@mtn.com"
							value={form.values.username}
							onChange={event => form.setFieldValue('username', event.currentTarget.value)}
							error={form.errors.username}
						/>

						<Box mb="xs">
							<TextInput
								value={form.values.password}
								onChange={event => form.setFieldValue('password', event.currentTarget.value)}
								placeholder="Password"
								label="Password"
								type="password"
								mb="xs"
								icon={
									<ThemeIcon color="transparent" size="sm">
										<IconLock color="gray" />
									</ThemeIcon>
								}
								error={form.errors.password}
							/>
							<Link to={ROUTES.PASSWORD_RESET}>Reset Password</Link>
						</Box>
					</Stack>
					<Stack>
						<Button onClick={() => mutation.mutate()}>Sign In</Button>
					</Stack>
				</form>
			</Paper>
		</Container>
	)
})
