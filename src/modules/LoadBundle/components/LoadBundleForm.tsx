import { TextInput, Flex, Button, Text, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconGauge, IconPhone } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import useRequest from '../../../hooks/useRequest';
import { formatCurrency } from '../../../utils/currenyFormatter';

type TLoadBundleFormProps = {
	selectedSrvCode: string;
	amount: string;
	speed: string;
};

export default function LoadBundleForm({ selectedSrvCode, amount, speed }: TLoadBundleFormProps) {
	const form = useForm({
		initialValues: {
			msisdn: '',
			bnumber: '',
			email: '',
			externalTransactionId: '1234',
			paymentOption: 'MOMO',
		},

		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid WakaNet Number'),
			msisdn: (val: string) =>
				val.length > 9 ? null : 'Should be a valid customer/agent number',
			// email: (val: string) =>
			// 	/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val)
			// 		? null
			// 		: 'Invalid email address',
			// externalTransactionId: (val: string) => (val ? null : 'Transaction ID is required'),
		},
	});

	const request = useRequest(true);

	const mutation = useMutation({
		mutationFn: () =>
			request.post(
				'/bundle-renewal',
				{
					...form.values,
					serviceCode: selectedSrvCode,
				},
				{
					headers: {
						user: '5GPortal',
						pass: 'meyb@cH',
					},
				}
			),
		onSuccess: (response: AxiosResponse) => {
			notifications.show({
				autoClose: 5000,
				message: response.data.message,
			});
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				// @ts-ignore
				message: error.response?.data?.message,
				color: 'red',
			});
		},
	});

	return (
		<form>
			<Center mb="xs">
				<IconGauge />
			</Center>
			<Text
				fw={600}
				mb="xs"
				ta="center"
			>{`${selectedSrvCode} - ${speed} - ${formatCurrency(amount)}`}</Text>

			<TextInput
				icon={<IconPhone />}
				label="WakaNet Number"
				mb="xs"
				value={form.values.bnumber}
				data-autofocus
				onChange={(event) => form.setFieldValue('bnumber', event.currentTarget.value)}
				error={form.errors.bnumber}
				placeholder="For example 2563945..."
				withAsterisk
			/>

			<TextInput
				icon={<IconPhone />}
				label="Agent/Customer Number"
				value={form.values.msisdn}
				onChange={(event) => form.setFieldValue('msisdn', event.currentTarget.value)}
				placeholder="For example 078..."
				error={form.errors.msisdn}
				withAsterisk
			/>
			<Flex
				gap={'sm'}
				w="100%"
				my="xs"
			>
				<Button
					fullWidth
					radius="md"
					onClick={() => {
						const validation = form.validate();
						console.log('Validation result:', validation); // Log validation result
						if (!validation.hasErrors) {
							console.log('Form is valid, triggering mutation...'); // Log before mutation
							mutation.mutate();
							form.reset();
						}
					}}
					disabled={mutation.isLoading}
					loading={mutation.isLoading}
				>
					Load
				</Button>
				<Button
					fullWidth
					radius="md"
					color="red"
					onClick={() => form.reset()}
				>
					Reset
				</Button>
			</Flex>
		</form>
	);
}
