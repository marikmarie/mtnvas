import { TextInput, Flex, Button, Text, Center, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconGauge, IconPhone, IconAt, IconReceipt2 } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import useRequest from '../../../hooks/useRequest';
import { formatCurrency } from '../../../utils/currenyFormatter';

type TLoadBundleFormProps = {
	selectedSrvCode: string;
	amount: string;
	speed: string;
	email: string | null;
	externalTransactionId: string;
	paymentOption: string | null;
};

export default function LoadBundleForm({
	selectedSrvCode,
	amount,
	speed,
	email,
	externalTransactionId,
	paymentOption,
}: TLoadBundleFormProps) {
	const form = useForm({
		initialValues: {
			msisdn: '',
			bnumber: '',
			email: email || '',
			externalTransactionId: externalTransactionId || '',
			paymentOption: paymentOption || '',
		},

		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid WakaNet Number'),
			msisdn: (val: string) =>
				val.length > 9 ? null : 'Should be a valid customer/agent number',
			email: (val: string) =>
				/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val)
					? null
					: 'Invalid email address',
			externalTransactionId: (val: string) => (val ? null : 'Transaction ID is required'),
		},
	});

	const request = useRequest(true);

	const mutation = useMutation({
		mutationFn: () =>
			request.post('/bundle-renewal', {
				...form.values,
				serviceCode: selectedSrvCode,
			}),
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
		<form onSubmit={form.onSubmit(() => mutation.mutate())}>
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

			<TextInput
				icon={<IconAt />}
				label="Email"
				value={form.values.email}
				onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
				placeholder="example@domain.com"
				error={form.errors.email}
			/>

			<TextInput
				icon={<IconReceipt2 />}
				label="Transaction ID"
				value={form.values.externalTransactionId}
				onChange={(event) =>
					form.setFieldValue('externalTransactionId', event.currentTarget.value)
				}
				placeholder="Enter transaction ID"
				error={form.errors.externalTransactionId}
				withAsterisk
			/>

			<Select
				label="Payment Option"
				placeholder="Select payment option"
				value={form.values.paymentOption}
				onChange={(value) => form.setFieldValue('paymentOption', value || '')}
				data={[{ value: 'MOMO', label: 'MOMO' }]}
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
					type="submit"
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
