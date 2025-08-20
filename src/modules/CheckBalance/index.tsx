import { Button, Divider, Flex, Loader, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';

const BalanceCheck: React.FC = () => {
	const [successModalOpened, successModalHandlers] = useDisclosure(false);
	const [errorModalOpened, errorModalHandlers] = useDisclosure(false);
	const request = useRequest();

	const form = useForm({
		initialValues: { bnumber: '' },
		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid wakanetNumber'),
		},
	});
	``;
	const mutation = useMutation({
		mutationFn: (data: typeof form.values) => request.post('/balance-detail', data),
		onSuccess: successModalHandlers.open,
		onError: errorModalHandlers.open,
	});

	const { balanceSummary, balanceDetail } = mutation.data?.data ?? {};

	const renderBalance = () => {
		if (!balanceDetail && !balanceSummary) {
			return (
				<Text
					fw="bold"
					mb="md"
					ta="center"
				>
					NONE
				</Text>
			);
		}
		return (
			<Stack>
				<Text ta="center">{balanceSummary}</Text>
				<Divider my="sm" />
				<Text ta="center">{balanceDetail}</Text>
			</Stack>
		);
	};

	const handleSubmit = form.onSubmit(() => mutation.mutate(form.values));

	return (
		<Paper py="lg">
			<Modal
				opened={successModalOpened}
				close={successModalHandlers.close}
			>
				<Text
					fw="bold"
					mb="md"
					ta="center"
				>
					BALANCE CHECK
				</Text>
				{renderBalance()}
			</Modal>

			<Modal
				opened={errorModalOpened}
				close={errorModalHandlers.close}
			>
				<Text
					ta="center"
					fw="bold"
				>
					Error Checking balance
				</Text>
				{/* @ts-ignore */}
				<Text>{mutation.error?.response?.data?.message}</Text>
			</Modal>

			<Text
				fz="xl"
				fw="bold"
				c="dimmed"
			>
				Check Customer Subscription balance
			</Text>

			<form onSubmit={handleSubmit}>
				<Stack mt="sm">
					<TextInput
						label="Router Number"
						{...form.getInputProps('bnumber')}
						placeholder="For example 2563945 ..."
						withAsterisk
					/>
				</Stack>

				<Flex
					mt="md"
					w="100%"
					gap="sm"
					justify="flex-end"
				>
					<Button
						fullWidth
						variant="filled"
						radius="md"
						type="submit"
						disabled={mutation.isLoading}
					>
						{mutation.isLoading ? (
							<Loader
								color="white"
								size="xs"
							/>
						) : (
							'Check Balance'
						)}
					</Button>
					<Button
						fullWidth
						variant="light"
						radius="md"
						onClick={form.reset}
					>
						Reset
					</Button>
				</Flex>
			</form>
		</Paper>
	);
};

export default React.memo(BalanceCheck);
