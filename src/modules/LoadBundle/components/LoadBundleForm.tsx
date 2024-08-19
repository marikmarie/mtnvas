import { TextInput, Flex, Button, Loader, Text, Center } from '@mantine/core';
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
		},

		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid WakaNet Number'),
			msisdn: (val: string) =>
				val.length > 9 ? null : 'Should be a valid custmer/agent number',
		},
	});

	const request = useRequest(true);

	const mutation = useMutation({
		mutationFn: () =>
			request.post('/load-bundle', {
				...form.values,
				serviceCode: selectedSrvCode, // Here, the proceeding -4G or -5G is removed so as the server recieves the correct serviceCode
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
				placeholder="Forexample 2563945..."
				withAsterisk
			/>
			<TextInput
				icon={<IconPhone />}
				label="Agent/Customer Number"
				value={form.values.msisdn}
				onChange={(event) => form.setFieldValue('msisdn', event.currentTarget.value)}
				placeholder="Forexample 078..."
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
					type="submit"
				>
					{mutation.isLoading ? (
						<Loader
							color="white"
							size={'xs'}
						/>
					) : (
						'Load'
					)}
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
