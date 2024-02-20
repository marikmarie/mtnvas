import { Button, Divider, Flex, Loader, Paper, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import useRequest from '../hooks/use-request'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from './Modal'

export default React.memo(() => {
	const [opened, { open: openSuccess, close: closeSuccess }] = useDisclosure(false)
	const [errOpened, { open: openErr, close: closeErr }] = useDisclosure(false)

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
		mutationFn: () => request.post('/balance-detail', form.values),
		onSuccess: () => openSuccess(),
		onError: () => openErr(),
	})

	const parts = mutation.data?.data?.message?.split(',') as string[]

	console.log(parts)

	return (
		<Paper py="lg">
			<Modal opened={opened} close={closeSuccess}>
				<Text fw="bold" mb="md" ta="center">
					BALANCE CHECK
				</Text>
				{parts?.map(part =>
					part ? (
						<Flex gap={'md'} m="md" justify={'space-between'} align={'center'}>
							<Button variant="light" fullWidth>
								{part.split(':')[1].split(' ')[0]}
							</Button>
							<Button variant="outline" fullWidth>
								{(() => {
									const parts = part.split(' ')
									return parts[2] + ' ' + parts[3]
								})()}
							</Button>
							<Divider />
						</Flex>
					) : null,
				)}
			</Modal>
			<Modal opened={errOpened} close={closeErr}>
				{/* @ts-ignore */}
				<Text>{mutation.error?.response?.data?.message}</Text>
			</Modal>
			<Text fz="xl" fw="bold" c="dimmed">
				Check Customer Subscription balance
			</Text>

			<Stack mt={'sm'}>
				<TextInput
					label="WakaNet Number"
					onChange={event => form.setFieldValue('bnumber', event.currentTarget.value)}
					error={form.errors.bnumber}
					value={form.values.bnumber}
					placeholder="Forexample 2563945 ..."
					withAsterisk
				/>
			</Stack>

			<Flex mt="md" w="100%" gap={'sm'} justify={'flex-end'}>
				<Button fullWidth variant="filled" onClick={() => mutation.mutate()}>
					{mutation.isLoading ? <Loader color="white" variant="dots" /> : 'Check Balance'}
				</Button>
				<Button fullWidth variant="light" onClick={() => form.reset()}>
					Reset
				</Button>
			</Flex>
		</Paper>
	)
})
