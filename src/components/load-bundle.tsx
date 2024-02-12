import { Badge, Box, Button, Divider, Flex, Group, Paper, Radio, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPhone } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse, AxiosError } from 'axios'
import { ReactNode, memo } from 'react'
import useRequest from '../hooks/use-request'

export default memo(() => {
	const request = useRequest()

	const form = useForm({
		initialValues: {
			msisdn: '',
			bnumber: '',
			serviceCode: '',
		},

		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid WakaNet Number'),
			msisdn: (val: string) => (val.length > 9 ? null : 'Should be a valid custmer/agent number'),
			serviceCode: (val: string) => (!val ? 'Service Code is required' : null),
		},
	})

	const mutation = useMutation({
		mutationFn: () => request.post('/load-bundle', form.values),
		onSuccess: (_: AxiosResponse) => {
			notifications.show({
				autoClose: 10000,
				title: 'Success',
				// @ts-ignore
				message: _.data?.message,
				color: 'green',
			})
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 10000,
				title:
					((error.response?.data as { httpStatus: string }).httpStatus as unknown as ReactNode) ||
					((
						error.response?.data as {
							status: string
						}
					).status as unknown as ReactNode),
				message:
					((
						error.response?.data as {
							message: string
						}
					).message! as unknown as ReactNode) ||
					((
						error.response?.data as {
							error: string
						}
					).error as unknown as ReactNode),
				color: 'red',
			})
		},
	})

	return (
		<Paper py="lg">
			<Text fz="xl" fw="bold" tt="uppercase">
				Load new WakaNet bundle
			</Text>

			<form>
				<Stack mt={'sm'}>
					<TextInput
						icon={<IconPhone />}
						label="WakaNet Number"
						onChange={event => form.setFieldValue('bnumber', event.currentTarget.value)}
						error={form.errors.bnumber}
						placeholder="Forexample 2563945..."
						withAsterisk
					/>
					<Paper withBorder p="md">
						<Stack>
							<Box>
								<Text fz="xl" fw="bold" tt="uppercase">
									Wakanet 5G
								</Text>

								<Radio.Group
									name="serviceCode"
									withAsterisk
									value={form.values.serviceCode}
									onChange={value => form.setFieldValue('serviceCode', value)}
									error={form.errors.bnumber}
								>
									<Group mt="xs">
										<Radio
											value="FWA_40MBPS"
											label={
												<Badge variant="outline" size="lg">
													40MBPS (295000)
												</Badge>
											}
										/>
										<Radio
											value="FWA_60MBPS"
											label={
												<Badge variant="outline" size="lg">
													60MBPS (395000)
												</Badge>
											}
										/>
										<Radio
											value="FWA_80MBPS"
											label={
												<Badge variant="outline" size="lg">
													80MBPS (495000)
												</Badge>
											}
										/>
										<Radio
											value="FWA_100MBPS"
											label={
												<Badge variant="outline" size="lg">
													100MBPS (595000)
												</Badge>
											}
										/>
										<Radio
											value="FWA_150MBPS"
											label={
												<Badge variant="outline" size="lg">
													150MBPS (695000)
												</Badge>
											}
										/>
									</Group>
								</Radio.Group>
							</Box>
							<Divider />
							<Box>
								<Text fz="xl" fw="bold" tt="uppercase">
									Wakanet 4G
								</Text>

								<Radio.Group
									name="serviceCode"
									withAsterisk
									value={form.values.serviceCode}
									onChange={value => form.setFieldValue('serviceCode', value)}
									error={form.errors.bnumber}
								>
									<Group mt="xs">
										<Radio
											value="FWA_3MBPS"
											label={
												<Badge variant="outline" size="lg">
													{' '}
													3MBPS (55000)
												</Badge>
											}
										/>
										<Radio
											value="FWA_5MBPS"
											label={
												<Badge variant="outline" size="lg">
													{' '}
													5MBPS (85000)
												</Badge>
											}
										/>
										<Radio
											value="FWA_10MBPS"
											label={
												<Badge variant="outline" size="lg">
													{' '}
													10MBPS (130000)
												</Badge>
											}
										/>
										<Radio
											value="FWA_20MBPS"
											label={
												<Badge variant="outline" size="lg">
													{' '}
													20MBPS (195000)
												</Badge>
											}
										/>
									</Group>
								</Radio.Group>
							</Box>
							<Divider />

							<Box>
								<Text fz="xl" fw="bold" tt="uppercase">
									WakaNet Bundles
								</Text>

								<Radio.Group
									name="serviceCode"
									withAsterisk
									value={form.values.serviceCode}
									onChange={value => form.setFieldValue('serviceCode', value)}
									error={form.errors.bnumber}
								>
									<Group mt="xs">
										<Radio
											value="ITTH_10GB_PST"
											label={
												<Badge variant="outline" size="lg">
													starterpack
												</Badge>
											}
										/>
										<Radio
											value="1778FHI4"
											label={
												<Badge variant="outline" size="lg">
													{' '}
													5MBPS (55000){' '}
												</Badge>
											}
										/>
										<Radio
											value="1778FHI1"
											label={
												<Badge variant="outline" size="lg">
													{' '}
													10MBPS (85000){' '}
												</Badge>
											}
										/>
										<Radio
											value="1778FHI2"
											label={
												<Badge variant="outline" size="lg">
													{' '}
													20MBPS (170000){' '}
												</Badge>
											}
										/>
										<Radio
											value="1778FHI3"
											label={
												<Badge variant="outline" size="lg">
													{' '}
													20MBPS (335000){' '}
												</Badge>
											}
										/>
									</Group>
								</Radio.Group>
							</Box>
						</Stack>
					</Paper>

					<TextInput
						icon={<IconPhone />}
						label="Agent/Customer Number"
						value={form.values.msisdn}
						onChange={event => form.setFieldValue('msisdn', event.currentTarget.value)}
						placeholder="Forexample 078..."
						withAsterisk
					/>
				</Stack>

				<Flex mt="md" w="100%" gap={'sm'} justify={'flex-end'}>
					<Flex gap={'sm'} w="30%">
						<Button fullWidth variant="outline" onClick={() => mutation.mutate()}>
							Load
						</Button>
						<Button fullWidth variant="light" onClick={() => form.reset()}>
							Reset
						</Button>
					</Flex>
				</Flex>
			</form>
		</Paper>
	)
})
