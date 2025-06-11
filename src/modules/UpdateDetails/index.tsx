import { Button, Flex, Loader, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import UpdateDetailsModal from './components/UpdateDetailsModal';

export default React.memo(() => {
	const request = useRequest(true);

	const [opened, { close }] = useDisclosure(false);

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
		mutationKey: ['update-details'],
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
