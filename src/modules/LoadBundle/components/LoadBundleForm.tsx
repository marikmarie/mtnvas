import { TextInput, Flex, Button, Text, Center, Stack, useMantineTheme } from '@mantine/core';
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
	onClose?: () => void;
};

export default function LoadBundleForm({
	selectedSrvCode,
	amount,
	speed,
	onClose,
}: TLoadBundleFormProps) {
	const theme = useMantineTheme();
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
			form.reset();
			onClose?.();
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				// @ts-ignore
				message: error.response?.data?.message || 'An error occurred',
				color: 'red',
			});
		},
	});

	return (
		<form onSubmit={form.onSubmit(() => mutation.mutate())}>
			<Stack>
				<Center>
					<IconGauge
						size={30}
						color={theme.primaryColor}
					/>
				</Center>
				<Text
					fw={600}
					mb="xs"
					ta="center"
				>{`${selectedSrvCode} - ${speed} - ${formatCurrency(amount)}`}</Text>

				<TextInput
					icon={<IconPhone size={16} />}
					label="WakaNet Number"
					value={form.values.bnumber}
					data-autofocus
					onChange={(event) => form.setFieldValue('bnumber', event.currentTarget.value)}
					error={form.errors.bnumber}
					placeholder="e.g., 25639..."
					withAsterisk
				/>

				<TextInput
					icon={<IconPhone size={16} />}
					label="Agent/Customer Payment Number"
					value={form.values.msisdn}
					onChange={(event) => form.setFieldValue('msisdn', event.currentTarget.value)}
					placeholder="e.g., 07..."
					error={form.errors.msisdn}
					withAsterisk
				/>
				<Flex
					gap={'sm'}
					w="100%"
					mt="md"
				>
					<Button
						fullWidth
						radius="md"
						type="submit"
						disabled={mutation.isLoading}
						loading={mutation.isLoading}
						color={theme.primaryColor}
					>
						Load Bundle
					</Button>
					<Button
						fullWidth
						radius="md"
						variant="outline"
						onClick={() => {
							form.reset();
							onClose?.();
						}}
					>
						Cancel
					</Button>
				</Flex>
			</Stack>
		</form>
	);
}
