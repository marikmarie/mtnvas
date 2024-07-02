import { Button, Flex, Loader, Paper, Stack, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import React from 'react';
import { useForm } from '@mantine/form';
import UpdateDetailsModal from './components/UpdateDetailsModal';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/use-request';

export default React.memo(() => {
	const request = useRequest(true);
	const qc = useQueryClient();

	const [opened, { open, close }] = useDisclosure(false);

	const form = useForm({
		initialValues: {
			wakanetNumber: '',
		},

		validate: {
			wakanetNumber: (val: string) =>
				val.length > 9 ? null : 'Should be a valid wakanetNumber',
		},
	});

	const mutation = useMutation({
		mutationFn: (wakanetNumber: string) =>
			request.post('/customer-details', { bnumber: wakanetNumber }),
		onSuccess: (response: AxiosResponse) => {
			open();
			qc.invalidateQueries({
				queryKey: ['update-details'],
			});
			notifications.show({
				autoClose: 5000,
				title: 'Success',
				// @ts-ignore
				message: JSON.stringify(response.data),
				color: 'green',
			});
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				title: 'FAILURE',
				message: JSON.stringify(error.response?.data),
				color: 'red',
			});
		},
	});

	const details = mutation.data?.data?.data;

	return (
		<Paper py="lg">
			<Text
				fz="xl"
				fw="bold"
				c="dimmed"
			>
				Update Existing customer details
			</Text>

			<Modal
				opened={opened}
				close={close}
			>
				<UpdateDetailsModal detail={details || null} />
			</Modal>

			<form onSubmit={form.onSubmit(() => mutation.mutate(form.values.wakanetNumber))}>
				<Stack mt={'sm'}>
					<TextInput
						label="Router Number"
						value={form.values.wakanetNumber}
						onChange={(event) =>
							form.setFieldValue('wakanetNumber', event.currentTarget.value)
						}
						error={form.errors.wakanetNumber}
						placeholder="Forexample 2563945..."
						withAsterisk
					/>
				</Stack>

				<Flex
					mt="md"
					w="100%"
					justify={'flex-end'}
					gap={'sm'}
				>
					<Button
						leftIcon={<IconSearch />}
						type="submit"
						variant="filled"
						radius="md"
					>
						{mutation.isLoading ? (
							<Loader
								color="white"
								size={'xs'}
							/>
						) : (
							'Searh User'
						)}
					</Button>
				</Flex>
			</form>
		</Paper>
	);
});
