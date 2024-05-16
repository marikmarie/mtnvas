import { Button, LoadingOverlay, TextInput, ThemeIcon } from '@mantine/core'
import { IconMail, IconLock } from '@tabler/icons-react'
import { memo, useCallback } from 'react'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import useRequest from '../../hooks/use-request'
import { notifications } from '@mantine/notifications'
import { customLoader } from '../custom-loader'

interface Props { }

function Adduser( props: Props ) {
	const { } = props

	const request = useRequest( true )
	const queryClient = useQueryClient()

	const form = useForm( {
		initialValues: {
			name: '',
			email: '',
			phoneNumber: '',
		},

		validate: {
			email: ( val: string ) =>
				/^\S+@gdexperts\.com$/.test( val ) || /^\S+@mtn\.com$/.test( val )
					? null
					: 'Should be a valid MTN or GDExperts EMAIL',
			name: ( val: string ) =>
				val.length < 3 ? 'Name should be at least 3 characters' : null,
			phoneNumber: ( val: string ) =>
				/^\+?256787\d{6}$/.test( val ) ? null : 'Must be a valid Ugandan phone number starting with +256787',
		},
	} )

	const mutation = useMutation( {
		mutationFn: () => request.post( '/users/add', { ...form.values } ),
		onSuccess: ( response: AxiosResponse ) => {
			notifications.show( {
				autoClose: 5000,
				title: 'Success',
				// @ts-ignore
				message: response.data.message,
				color: 'green',
			} )
			queryClient.invalidateQueries( {
				queryKey: ['users'],
			} )
		},
		onError: ( error: AxiosError ) => {
			notifications.show( {
				autoClose: 5000,
				title:
					( ( error.response?.data as { httpStatus: string } ).httpStatus as unknown as React.ReactNode ) ||
					( (
						error.response?.data as {
							status: string
						}
					).status as unknown as React.ReactNode ),
				message:
					( (
						error.response?.data as {
							message: string
						}
					).message! as unknown as React.ReactNode ) ||
					( (
						error.response?.data as {
							error: string
						}
					).error as unknown as React.ReactNode ),
				color: 'red',
			} )
		},
	} )

	const onSubmit = useCallback( () => {
		console.log( form.values )
		mutation.mutate()
		// form.reset()
	}, [] )

	return (
		<form onSubmit={form.onSubmit( onSubmit )}>
			<LoadingOverlay visible={mutation.isLoading} loader={customLoader} zIndex={999} />
			<TextInput
				label="Name"
				icon={
					<ThemeIcon color="transparent" size="sm">
						<IconMail color="gray" />
					</ThemeIcon>
				}
				placeholder="Name"
				value={form.values.name}
				onChange={event => form.setFieldValue( 'name', event.currentTarget.value )}
				error={form.errors.name}
			/>

			<TextInput
				value={form.values.email}
				onChange={event => form.setFieldValue( 'email', event.currentTarget.value )}
				placeholder="Email"
				label="Email"
				type="email"
				mb="xs"
				icon={
					<ThemeIcon color="transparent" size="sm">
						<IconLock color="gray" />
					</ThemeIcon>
				}
				error={form.errors.email}
			/>
			<TextInput
				value={form.values.phoneNumber}
				onChange={event => form.setFieldValue( 'phoneNumber', event.currentTarget.value )}
				placeholder="Phone number"
				label="Phone number"
				mb="xs"
				icon={
					<ThemeIcon color="transparent" size="sm">
						<IconLock color="gray" />
					</ThemeIcon>
				}
				error={form.errors.phoneNumber}
			/>
			<Button fullWidth type='submit' loaderPosition='left' loaderProps={{
				variant: "dots",
			}}>Add user</Button>
		</form>
	)
}

export default memo( Adduser )
