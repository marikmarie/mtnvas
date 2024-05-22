import { Button, Divider, Flex, Loader, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import useRequest from '../hooks/use-request';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from './Modal';

export default React.memo(() => {
	const [opened, { open: openSuccess, close: closeSuccess }] = useDisclosure(false);
	const [errOpened, { open: openErr, close: closeErr }] = useDisclosure(false);

	const request = useRequest(false);
	const form = useForm({
		initialValues: {
			bnumber: '',
		},

		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid wakanetNumber'),
		},
	});

	const mutation = useMutation({
		mutationFn: () => request.post('/balance-detail', form.values),
		onSuccess: () => openSuccess(),
		onError: () => openErr(),
	});

	const balanceSummary = mutation.data?.data.balanceSummary;
	const balanceDetails = mutation.data?.data.balanceDetail;

	const balance =
		balanceDetails && balanceSummary ? (
			<>
				<Text ta="center">{balanceSummary}</Text>
				<Divider my="sm" />
				<Text ta="center">{balanceDetails}</Text>
			</>
		) : (
			<Text
				fw="bold"
				mb="md"
				ta="center"
			>
				NONE
			</Text>
		);

	return (
		<Paper py="lg">
			<Modal
				opened={opened}
				close={closeSuccess}
			>
				<Text
					fw="bold"
					mb="md"
					ta="center"
				>
					BALANCE CHECK
				</Text>
				{balance}
			</Modal>
			<Modal
				opened={errOpened}
				close={closeErr}
			>
				<Text
					ta="center"
					fw="bold"
				>
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

			<Text
				fz="xl"
				fw="bold"
				c="dimmed"
			>
				Check Customer Subscription balance
			</Text>
			<form onSubmit={form.onSubmit(() => mutation.mutate())}>
				<Stack mt={'sm'}>
					<TextInput
						label="WakaNet Number"
						onChange={(event) =>
							form.setFieldValue('bnumber', event.currentTarget.value)
						}
						error={form.errors.bnumber}
						value={form.values.bnumber}
						placeholder="Forexample 2563945 ..."
						withAsterisk
					/>
				</Stack>

				<Flex
					mt="md"
					w="100%"
					gap={'sm'}
					justify={'flex-end'}
				>
					<Button
						fullWidth
						variant="filled"
						type="submit"
					>
						{mutation.isLoading ? (
							<Loader
								color="white"
								size={'xs'}
							/>
						) : (
							'Check Balance'
						)}
					</Button>
					<Button
						fullWidth
						variant="light"
						onClick={() => form.reset()}
					>
						Reset
					</Button>
				</Flex>
			</form>
		</Paper>
	);
});
