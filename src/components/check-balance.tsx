import { Button, Flex, Paper, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse, AxiosError } from 'axios'
import React from 'react'
import useRequest from '../hooks/use-request'

export default React.memo(() => {
	const request = useRequest()
	const form = useForm({
		initialValues: {
			bnumber: '',
		},

		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid wakanetNumber'),
		},
	})

	const mutation = useMutation({
		mutationFn: () => request.post('/balance-check', form.values),
		onSuccess: (_: AxiosResponse) => {
			notifications.show({
				title: 'Success',
				// @ts-ignore
				message: _.data?.message,
				color: 'green',
			})
			form.reset()
		},
		onError: (error: AxiosError) => {
			notifications.show({
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
		<Paper p="lg" mt="xl" shadow="lg">
			<Text fz="xl" fw="bold" c="dimmed">
				Check Customer Subscription balance
			</Text>

			<form onSubmit={form.onSubmit(() => mutation.mutate())}>
				<Stack mt={'sm'}>
					<TextInput
						label="WakaNet Number"
						onChange={event => form.setFieldValue('bnumber', event.currentTarget.value)}
						error={form.errors.bnumber}
						placeholder="Forexample 2563945 ..."
						withAsterisk
					/>
				</Stack>

				<Flex mt="md" w="100%" gap={'sm'} justify={'flex-end'}>
					<Button fullWidth variant="filled" type="submit">
						Check Balance
					</Button>
					<Button fullWidth variant="light" onClick={() => form.reset()}>
						Reset
					</Button>
				</Flex>
			</form>
		</Paper>
	)
})
