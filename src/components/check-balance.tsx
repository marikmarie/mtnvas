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

	const request = useRequest(false)
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

	const parts = mutation.data?.data?.message ? (mutation.data?.data?.message.split(',') as string[]) : []

	return (
		<Paper py="lg">
			<Modal opened={opened} close={closeSuccess}>
				<Text fw="bold" mb="md" ta="center">
					BALANCE CHECK
				</Text>
				{parts?.length > 0 ? (
					parts?.map(part =>
						part ? (
							<Flex key={part} gap={'md'} m="md" justify={'space-between'} align={'center'}>
								<Button variant="light" fullWidth>
									{part && part.split(':')[1] && part.split(':')[1].split(' ')[0]}
								</Button>
								{/* <Button variant="outline" fullWidth> */}
								{(() => {
									const partsArray = part && part.split(' ')
									return partsArray && partsArray[2] && partsArray[3] ? (
										<Button variant="outline" fullWidth>
											{partsArray[2] + ' ' + partsArray[3]}
										</Button>
									) : null
								})()}
								{/* </Button> */}
								<Divider />
							</Flex>
						) : null,
					)
				) : (
					<Text fw="bold" mb="md" ta="center">
						NONE
					</Text>
				)}
			</Modal>
			<Modal opened={errOpened} close={closeErr}>
				<Text ta="center" fw="bold">
					Error Checking balance
				</Text>
				<Text>
					{mutation.error &&
						// @ts-ignore
						mutation.error.response &&
						// @ts-ignore
						mutation.error.response.data &&
						// @ts-ignore
						mutation.error.response.data.message}
				</Text>
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
					{mutation.isLoading ? <Loader color="white" size={'xs'} /> : 'Check Balance'}
				</Button>
				<Button fullWidth variant="light" onClick={() => form.reset()}>
					Reset
				</Button>
			</Flex>
		</Paper>
	)
})
