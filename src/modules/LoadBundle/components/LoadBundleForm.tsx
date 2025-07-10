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
	speed: string;
};

export default function LoadBundleForm({ selectedSrvCode, amount, speed }: TLoadBundleFormProps) {
	const form = useForm({
		initialValues: {
			msisdn: '',
			bnumber: '',
			sponsorEmail: '',
			beneficiaryEmail: '',
			externalTransactionId: '1234',
			paymentOption: 'MOMO',
			redirectLink: '',
		},

		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid WakaNet Number'),
			msisdn: (val: string) =>
				val.length > 9 ? null : 'Should be a valid customer/agent number',
			// sponsorEmail and beneficiaryEmail are optional, so no validation
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
					sponsorEmail: form.values.sponsorEmail || null,
					beneficiaryEmail: form.values.beneficiaryEmail || null,
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

			<TextInput
				label="Sponsor Email (optional)"
				value={form.values.sponsorEmail}
				onChange={(event) => form.setFieldValue('sponsorEmail', event.currentTarget.value)}
				placeholder="e.g. sarah.buteraba@mtn.com"
			/>
			<TextInput
				label="Beneficiary Email (optional)"
				value={form.values.beneficiaryEmail}
				onChange={(event) =>
					form.setFieldValue('beneficiaryEmail', event.currentTarget.value)
				}
				placeholder="e.g. sarah.buteraba@mtn.com"
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
