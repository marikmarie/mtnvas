import { Button, LoadingOverlay, Select, TextInput, ThemeIcon } from '@mantine/core';
import { IconLock, IconMail } from '@tabler/icons-react';
import { memo, useCallback } from 'react';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import useRequest from '../../hooks/use-request';
import { notifications } from '@mantine/notifications';
import { customLoader } from '../../components/CustomLoader';

interface Props {}

function Adduser(props: Props) {
	const {} = props;

	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm({
		initialValues: {
			name: '',
			email: '',
			category: '',
			phoneNumber: '',
			role: '',
		},

		validate: {
			email: (val: string) =>
				/^\S+@gdexperts\.com$/.test(val) || /^\S+@mtn\.com$/.test(val)
					? null
					: 'Should be a valid MTN or GDExperts EMAIL',
			name: (val: string) => (val.length < 3 ? 'Name should be at least 3 characters' : null),
			category: (val: string) => (val.length === 0 ? 'Category is required' : null),
			role: (val: string) =>
				['CEX', 'SERVICE_CENTER', 'WAKA_CORP'].includes(val)
					? 'Role should be one of CEX,SERVICE_CENTER or WAKA_CORP'
					: null,
			phoneNumber: (val: string) =>
				/^\+?256787\d{6}$/.test(val)
					? null
					: 'Must be a valid Ugandan phone number starting with +256787',
		},
	});

	const mutation = useMutation({
		mutationFn: () => request.post('/users/add', { ...form.values }),
		onSuccess: async (response: AxiosResponse) => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
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

	const onSubmit = useCallback(() => {
		console.log(form.values);
		mutation.mutate();
		form.reset();
	}, [mutation, form]);

	return (
		<form onSubmit={form.onSubmit(onSubmit)}>
			<LoadingOverlay
				visible={mutation.isLoading}
				loader={customLoader}
				zIndex={999}
			/>
			<TextInput
				label="Name"
				icon={
					<ThemeIcon
						color="transparent"
						size="sm"
					>
						<IconMail color="gray" />
					</ThemeIcon>
				}
				placeholder="Name"
				value={form.values.name}
				onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
				error={form.errors.name}
			/>

			<TextInput
				value={form.values.email}
				onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
				placeholder="Email"
				label="Email"
				type="email"
				mb="xs"
				icon={
					<ThemeIcon
						color="transparent"
						size="sm"
					>
						<IconLock color="gray" />
					</ThemeIcon>
				}
				error={form.errors.email}
			/>
			<TextInput
				value={form.values.phoneNumber}
				onChange={(event) => form.setFieldValue('phoneNumber', event.currentTarget.value)}
				placeholder="Phone number"
				label="Phone number"
				mb="xs"
				icon={
					<ThemeIcon
						color="transparent"
						size="sm"
					>
						<IconLock color="gray" />
					</ThemeIcon>
				}
				error={form.errors.phoneNumber}
			/>
			<TextInput
				value={form.values.category}
				onChange={(event) => form.setFieldValue('category', event.currentTarget.value)}
				placeholder="Category"
				label="Category"
				mb="xs"
				icon={
					<ThemeIcon
						color="transparent"
						size="sm"
					>
						<IconLock color="gray" />
					</ThemeIcon>
				}
				error={form.errors.category}
			/>
			<Select
				label="Select role"
				placeholder="Select role"
				mb="xs"
				value={form.values.role}
				onChange={(value) => form.setFieldValue('role', value!)}
				error={form.errors.role}
				data={[
					{ value: 'CEX', label: 'CEX' },
					{ value: 'SERVICE_CENTER', label: 'SERVICE_CENTER' },
					{ value: 'WAKA_CORP', label: 'WAKA_CORP' },
				]}
			/>
			<Button
				fullWidth
				type="submit"
				radius="md"
				loaderPosition="left"
				loaderProps={{
					variant: 'dots',
				}}
			>
				Add user
			</Button>
		</form>
	);
}

export default memo(Adduser);
