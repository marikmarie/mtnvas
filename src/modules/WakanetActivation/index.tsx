import { Button, Flex, Loader, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPhone, IconTextPlus } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import useRequest from '../../hooks/useRequest';

export const WakanetActivation = () => {
	const request = useRequest(true);

	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	const form = useForm({
		initialValues: {
			bnumber: '',
			msisdn: '',
			email: '',
			imei: '',
		},
		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid wakanetNumber'),
			msisdn: (val: string) => (val.length > 9 ? null : 'Should be a valid msisdn'),
			email: (val: string) => (emailRegex.test(val) ? null : 'Should be a valid email'),
			imei: (val: string) => (val.length > 0 ? null : 'Should be a valid imei'),
		},
	});

	const activation = useMutation({
		mutationFn: () => request.post('/wakanet-activation', form.values),
		onSuccess: () => {
			form.reset();
		},
	});

	return (
		<div>
			<form onSubmit={form.onSubmit(() => activation.mutate())}>
				<Stack py={'lg'}>
					<TextInput
						icon={<IconPhone />}
						label="WakaNet 4G/5G Router Number"
						value={form.values.bnumber}
						onChange={(event) =>
							form.setFieldValue('bnumber', event.currentTarget.value)
						}
						error={form.errors.bnumber}
						placeholder="Forexample 2563945..."
						withAsterisk
						w="100%"
					/>
					<TextInput
						icon={<IconPhone />}
						label="MSISDN"
						value={form.values.msisdn}
						onChange={(event) =>
							form.setFieldValue('msisdn', event.currentTarget.value)
						}
						error={form.errors.msisdn}
						placeholder="Forexample 25677... / 25678..."
						withAsterisk
						w="100%"
					/>
					<TextInput
						icon={<IconPhone />}
						label="EMAIL"
						value={form.values.email}
						onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
						error={form.errors.email}
						placeholder="first.last@mtn.com"
						withAsterisk
						w="100%"
					/>
					<TextInput
						icon={<IconTextPlus />}
						label="IMEI"
						value={form.values.imei}
						onChange={(event) => form.setFieldValue('imei', event.currentTarget.value)}
						error={form.errors.imei}
						placeholder="Enter IMEI"
						withAsterisk
						w="100%"
					/>
					<Flex
						justify={'center'}
						gap="xl"
						align={'center'}
					>
						<Button
							fullWidth
							type="submit"
							radius="md"
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
					</Flex>
				</Stack>
			</form>
		</div>
	);
};
