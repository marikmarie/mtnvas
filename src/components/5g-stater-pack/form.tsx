import { Stack, Flex, Badge, TextInput, Button, Text, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconCircleCheck, IconPhone, IconRestore } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import useRequest from '../../hooks/use-request'

export const Form = () => {
	const request = useRequest(true)

	const subscriptionId = useSelector((state: RootState) => state.bundleActivation.subscriptionId)

	const form = useForm({
		initialValues: {
			bnumber: '',
			subscriptionId: '',
		},
		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid wakanetNumber'),
		},
	})

	const activation = useMutation({
		mutationFn: () => request.post('/bundle-activations', { ...form.values, subscriptionId }),
	})
	const rejection = useMutation({
		mutationFn: () => request.post('/reject-activations', { ...form.values, subscriptionId }),
	})

	return (
		<div>
			{subscriptionId ? (
				<form>
					<Stack my={'sm'}>
						<Flex justify={'start'} gap="xl" align={'center'}>
							<Badge variant="light" size="xl">
								Subscription Id
							</Badge>
							<Text>{subscriptionId}</Text>
						</Flex>
						<TextInput
							icon={<IconPhone />}
							label="WakaNet Number"
							value={form.values.bnumber}
							onChange={event => form.setFieldValue('bnumber', event.currentTarget.value)}
							error={form.errors.bnumber}
							placeholder="Forexample 2563945..."
							withAsterisk
							w="100%"
						/>
						<Flex justify={'start'} gap="xl" align={'center'}>
							<Button leftIcon={<IconCircleCheck />} fullWidth onClick={() => activation.mutate()}>
								{activation.isLoading ? <Loader color="white" size={'xs'} /> : 'Activate'}
							</Button>
							<Button leftIcon={<IconRestore stroke={2} />} fullWidth color="red" onClick={() => rejection.mutate()}>
								{rejection.isLoading ? <Loader color="white" size={'xs'} /> : 'Refund'}
							</Button>
						</Flex>
					</Stack>
				</form>
			) : null}
		</div>
	)
}
