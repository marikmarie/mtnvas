import { Flex, Badge, TextInput, Button, Text, Loader, Paper, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCircleCheck, IconPhone, IconRestore } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import useRequest from '../../../hooks/useRequest';
import { notifications } from '@mantine/notifications';
import { AxiosResponse, AxiosError } from 'axios';
import { setServiceCode, setSubscriptionId } from '../../../app/slices/BundleActivations';

export const Form = () => {
	const request = useRequest(true);

	const subscriptionId = useSelector((state: RootState) => state.bundleActivation.subscriptionId);
	const dispatch = useDispatch();

	const form = useForm({
		initialValues: {
			bnumber: '',
			subscriptionId: '',
		},
		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid wakanetNumber'),
		},
	});

	const onReset = function () {
		dispatch(setSubscriptionId(''));
		dispatch(setServiceCode(''));
		form.reset();
	};

	const activation = useMutation({
		mutationFn: () => request.post('/bundle-activations', { ...form.values, subscriptionId }),
		onSuccess: (response: AxiosResponse) => {
			notifications.show({
				autoClose: 5000,
				title: 'Success',
				// @ts-ignore
				message: response.data.message,
				color: 'green',
			});
			onReset();
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				title: 'FAILURE',
				message: JSON.stringify(error.response?.data),
				color: 'red',
			});
			onReset();
		},
	});
	const rejection = useMutation({
		mutationFn: () => request.post('/reject-activations', { ...form.values, subscriptionId }),
		onSuccess: (response: AxiosResponse) => {
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
			onReset();
		},
	});

	return (
		<div>
			{subscriptionId ? (
				<form onSubmit={form.onSubmit(() => activation.mutate())}>
					<Paper my={'sm'}>
						<Stack>
							<Flex
								justify={'start'}
								gap="xl"
								align={'center'}
							>
								<Badge
									variant="light"
									size="xl"
								>
									Subscription Id
								</Badge>
								<Text>{subscriptionId}</Text>
							</Flex>
							<TextInput
								icon={<IconPhone />}
								label="WakaNet Number"
								value={form.values.bnumber}
								onChange={(event) =>
									form.setFieldValue('bnumber', event.currentTarget.value)
								}
								error={form.errors.bnumber}
								placeholder="Forexample 2563945..."
								withAsterisk
								w="100%"
							/>
							<Flex
								justify={'start'}
								gap="xl"
								align={'center'}
							>
								<Button
									leftIcon={<IconCircleCheck />}
									fullWidth
									radius="md"
									type="submit"
									disabled={form.errors.bnumber ? true : false}
								>
									{activation.isLoading ? (
										<Loader
											color="white"
											size={'xs'}
										/>
									) : (
										'Activate'
									)}
								</Button>
								<Button
									leftIcon={<IconRestore stroke={2} />}
									fullWidth
									color={'red'}
									disabled={form.errors.bnumber ? true : false}
									onClick={() => rejection.mutate()}
									radius="md"
								>
									{rejection.isLoading ? (
										<Loader
											color="white"
											size={'xs'}
										/>
									) : (
										'Reject'
									)}
								</Button>
							</Flex>
						</Stack>
					</Paper>
				</form>
			) : null}
		</div>
	);
};
