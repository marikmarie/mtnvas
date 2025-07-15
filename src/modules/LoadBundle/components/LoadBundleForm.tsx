import { Button, Center, Flex, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconGauge, IconPhone } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
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
					color="red"
					onClick={() => form.reset()}
				>
					Reset
				</Button>
			</Flex>
		</form>
	);
}
