import { Button, Flex, Loader, Paper, Stack, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse, AxiosError } from 'axios'
import React from 'react'
import { useForm } from '@mantine/form'
import { Modal } from './Modal'
import UpdateDetailsModal from './update-details-modal'
import { useDisclosure } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import useRequest from '../hooks/use-request'

export default React.memo(() => {
	const request = useRequest()
	const qc = useQueryClient()

	const [opened, { open, close }] = useDisclosure(false)

	const form = useForm({
		initialValues: {
			wakanetNumber: '',
		},

		validate: {
			wakanetNumber: (val: string) => (val.length > 9 ? null : 'Should be a valid wakanetNumber'),
		},
	})

	const mutation = useMutation({
		mutationFn: (wakanetNumber: string) => request.post('/customer-details', { bnumber: wakanetNumber }),
		onSuccess: (_: AxiosResponse) => {
			open()
			notifications.show({
				autoClose: 60000,
				title: 'Success',
				// @ts-ignore
				message: _.data.message,
				color: 'green',
			})
			qc.invalidateQueries({
				queryKey: ['update-details'],
			})
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 60000,
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

	const details = mutation.data?.data?.data

	return (
		<Paper py="lg">
			<Text fz="xl" fw="bold" c="dimmed">
				Update Existing customer details
			</Text>

			<Modal opened={opened} close={close}>
				<UpdateDetailsModal detail={details || null} />
			</Modal>

			<Stack mt={'sm'}>
				<TextInput
					label="WakaNet Number"
					value={form.values.wakanetNumber}
					onChange={event => form.setFieldValue('wakanetNumber', event.currentTarget.value)}
					error={form.errors.wakanetNumber}
					placeholder="Forexample 2563945..."
					withAsterisk
				/>
			</Stack>

			<Flex mt="md" w="100%" justify={'flex-end'} gap={'sm'}>
				<Button
					leftIcon={<IconSearch />}
					onClick={() => mutation.mutate(form.values.wakanetNumber)}
					variant="filled"
				>
					{mutation.isLoading ? <Loader color="white" variant="dots" /> : 'Searh User'}
				</Button>
			</Flex>
		</Paper>
	)
})
