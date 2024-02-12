import { useForm } from '@mantine/form'
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
} from '@mantine/core'
import { IconAt, IconLock } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import useRequest from '../hooks/use-request'
import { notifications } from '@mantine/notifications'
import { AxiosError, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Auth, signin } from '../app/slices/auth'
import React from 'react'

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
	const request = useRequest()
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
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 10000,
				title:
					((error.response?.data as { httpStatus: string }).httpStatus as unknown as React.ReactNode) ||
					((
						error.response?.data as {
							status: string
						}
					).status as unknown as React.ReactNode),
				message:
					((
						error.response?.data as {
							message: string
						}
					).message! as unknown as React.ReactNode) ||
					((
						error.response?.data as {
							error: string
						}
					).error as unknown as React.ReactNode),
				color: 'red',
			})
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

						<TextInput
							value={form.values.password}
							onChange={event => form.setFieldValue('password', event.currentTarget.value)}
							placeholder="Password"
							label="Password"
							mb="md"
							type="password"
							icon={
								<ThemeIcon color="transparent" size="sm">
									<IconLock color="gray" />
								</ThemeIcon>
							}
							error={form.errors.password}
						/>
					</Stack>
					<Stack>
						<Button onClick={() => mutation.mutate()}>Sign In</Button>
					</Stack>
				</form>
			</Paper>
		</Container>
	)
})
