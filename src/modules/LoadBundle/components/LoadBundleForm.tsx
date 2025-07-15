import { Button, Center, Flex, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconGauge, IconPhone } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import useRequest from '../../../hooks/useRequest';
import { formatCurrency } from '../../../utils/currenyFormatter';

type TLoadBundleFormProps = {
	selectedSrvCode: string;
	amount: string;
	speed?: string;
	volume?: string;
};

export default function LoadBundleForm({
	selectedSrvCode,
	amount,
	speed,
	volume,
}: TLoadBundleFormProps) {
	const form = useForm({
		initialValues: {
			msisdn: '',
			bnumber: '',
			sponsorEmail: null,
			beneficiaryEmail: null,
			externalTransactionId: '',
			paymentOption: 'MOMO',
			redirectLink: '',
		},

		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid WakaNet Number'),
			msisdn: (val: string) =>
				val.length > 9 ? null : 'Should be a valid customer/agent number',
		},
	});

	const request = useRequest(true);

	const mutation = useMutation({
		mutationFn: () =>
			request.post(
				'/bundle-renewal',
				{
					msisdn: form.values.msisdn,
					bnumber: form.values.bnumber,
					sponsorEmail: null,
					beneficiaryEmail: null,
					externalTransactionId: form.values.externalTransactionId,
					serviceCode: selectedSrvCode,
					paymentOption: form.values.paymentOption,
					redirectLink: form.values.redirectLink || null,
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
				color: 'yellow',
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
				<IconGauge color="#ffcc08" />
			</Center>
			<Text
				fw={600}
				mb="xs"
				ta="center"
			>{`${selectedSrvCode} - ${speed ? speed : volume} - ${formatCurrency(amount)}`}</Text>

			<TextInput
				icon={<IconPhone color="#FFD600" />}
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
				icon={<IconPhone color="#FFD600" />}
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
					color="yellow"
					onClick={() => {
						const validation = form.validate();
						if (!validation.hasErrors) {
							const randomId = Math.floor(
								1000000000 + Math.random() * 9000000000
							).toString();
							form.setFieldValue('externalTransactionId', randomId);
							setTimeout(() => {
								mutation.mutate();
								form.reset();
							}, 0);
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
					color="yellow"
					variant="outline"
					onClick={() => form.reset()}
				>
					Reset
				</Button>
			</Flex>
		</form>
	);
}
