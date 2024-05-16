import { Accordion, Button, Flex, Loader, Paper, SimpleGrid, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPhone } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { memo, useState } from 'react'
import useRequest from '../hooks/use-request'
import { Package } from './package'
import { RootState } from '../app/store'
import { useSelector } from 'react-redux'

export default memo( () => {
	const request = useRequest( true )

	const [selectedSrvCode, setSelectedSrvCode] = useState( '' )

	const wakanet_5g = [
		{ serviceCode: 'FWA_40MBPS', amount: '29500UGX', speed: '40MBPS' },
		{ serviceCode: 'FWA_60MBPS', amount: '39500UGX', speed: '60MBPS' },
		{ serviceCode: 'FWA_80MBPS', amount: '49500UGX', speed: '80MBPS' },
		{ serviceCode: 'FWA_100MBPS', amount: '59500UGX', speed: '100MBPS' },
		{ serviceCode: 'FWA_150MBPS', amount: '69500UGX', speed: '150MBPS' },
	]

	const wakanet_4g = [
		{ serviceCode: 'FWA_3MBPS', amount: '55000UGX', speed: '3MBPS' },
		{ serviceCode: 'FWA_5MBPS', amount: '85000UGX', speed: '5MBPS' },
		{ serviceCode: 'FWA_10MBPS', amount: '130000UGX', speed: '10MBPS' },
		{ serviceCode: 'FWA_20MBPS', amount: '195000UGX', speed: '20MBPS' },
	]

	const wakanet_bundles = [
		{ serviceCode: 'ITTH_14GB', amount: '35000UGX', speed: '14GB' },
		{ serviceCode: '1778FHI4', amount: '55000UGX', speed: '25GB' },
		{ serviceCode: '1778FHI1', amount: '85000UGX', speed: '45GB' },
		{ serviceCode: '1778FHI2', amount: '170000UGX', speed: '95GB' },
		{ serviceCode: '1778FHI3', amount: '335000UGX', speed: '195GB' },
	]

	const post_paid_bundles = [
		{ serviceCode: 'Waka10PST', amount: '35000UGX', speed: '14GB' },
		{ serviceCode: 'Waka20PST', amount: '55000UGX', speed: '25GB' },
		{ serviceCode: 'Waka40PST', amount: '85000UGX', speed: '45GB' },
		{ serviceCode: 'Waka85PST', amount: '170000UGX', speed: '95GB' },
		{ serviceCode: 'Waka195PST', amount: '335000UGX', speed: '195GB' },
	]

	const user = useSelector( ( state: RootState ) => state.auth.user )

	const form = useForm( {
		initialValues: {
			msisdn: '',
			bnumber: '',
		},

		validate: {
			bnumber: ( val: string ) => ( val.length > 9 ? null : 'Should be a valid WakaNet Number' ),
			msisdn: ( val: string ) => ( val.length > 9 ? null : 'Should be a valid custmer/agent number' ),
		},
	} )

	const mutation = useMutation( {
		mutationFn: () => request.post( '/load-bundle', { ...form.values, serviceCode: selectedSrvCode } ),
	} )

	return (
		<Paper py="lg">
			<Text fz="xl" fw="bold">
				Load new WakaNet bundle
			</Text>

			<form>
				<TextInput
					icon={<IconPhone />}
					label="WakaNet Number"
					onChange={event => form.setFieldValue( 'bnumber', event.currentTarget.value )}
					error={form.errors.bnumber}
					placeholder="Forexample 2563945..."
					withAsterisk
				/>
				<Paper my={'md'}>
					<Stack>
						<Accordion variant="contained" defaultValue={'wakanet_5g'}>
							<Accordion.Item value="wakanet_5g">
								<Accordion.Control>
									<Text fz="xl" fw="bold">
										Wakanet 5G
									</Text>
								</Accordion.Control>
								<Accordion.Panel>
									<SimpleGrid
										cols={5}
										breakpoints={[
											{ maxWidth: 'lg', cols: 4 },
											{ maxWidth: 'md', cols: 3 },
											{ maxWidth: 'sm', cols: 2 },
											{ maxWidth: 'xs', cols: 1 },
										]}
									>
										{wakanet_5g.map( srv => (
											<Package
												selectedSrvCode={selectedSrvCode}
												key={srv.serviceCode}
												serviceCode={srv.serviceCode}
												setSelectedSrvCode={setSelectedSrvCode}
												amount={srv.amount}
												speed={srv.speed}
											/>
										) )}
									</SimpleGrid>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
						<Accordion variant="contained" defaultValue={"wakanet_4g"}>
							<Accordion.Item value="wakanet_4g">
								<Accordion.Control>
									<Text fz="xl" fw="bold">
										Wakanet 4G
									</Text>
								</Accordion.Control>
								<Accordion.Panel>
									<SimpleGrid
										cols={5}
										breakpoints={[
											{ maxWidth: 'lg', cols: 4 },
											{ maxWidth: 'md', cols: 3 },
											{ maxWidth: 'sm', cols: 2 },
											{ maxWidth: 'xs', cols: 1 },
										]}
									>
										{wakanet_4g.map( srv => (
											<Package
												key={srv.serviceCode}
												serviceCode={srv.serviceCode}
												selectedSrvCode={selectedSrvCode}
												setSelectedSrvCode={setSelectedSrvCode}
												amount={srv.amount}
												speed={srv.speed}
											/>
										) )}
									</SimpleGrid>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
						<Accordion variant="contained" defaultValue={"wakanet_bundles"}>
							<Accordion.Item value="wakanet_bundles">
								<Accordion.Control>
									<Text fz="xl" fw="bold">
										WakaNet Router Bundles
									</Text>
								</Accordion.Control>
								<Accordion.Panel>
									<SimpleGrid
										cols={5}
										breakpoints={[
											{ maxWidth: 'lg', cols: 4 },
											{ maxWidth: 'md', cols: 3 },
											{ maxWidth: 'sm', cols: 2 },
											{ maxWidth: 'xs', cols: 1 },
										]}
									>
										{wakanet_bundles.map( srv => (
											<Package
												key={srv.serviceCode}
												serviceCode={srv.serviceCode}
												selectedSrvCode={selectedSrvCode}
												setSelectedSrvCode={setSelectedSrvCode}
												amount={srv.amount}
												speed={srv.speed}
											/>
										) )}
									</SimpleGrid>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
						{user?.role === "WAKA_CORP" || user?.role ?
								<Accordion variant="contained">
									<Accordion.Item value="wakanet_bundles">
										<Accordion.Control>
											<Text fz="xl" fw="bold">
												PostPaid Bundles
											</Text>
										</Accordion.Control>
										<Accordion.Panel>
											<SimpleGrid
												cols={5}
												breakpoints={[
													{ maxWidth: 'lg', cols: 4 },
													{ maxWidth: 'md', cols: 3 },
													{ maxWidth: 'sm', cols: 2 },
													{ maxWidth: 'xs', cols: 1 },
												]}
											>
												{post_paid_bundles.map( srv => (
													<Package
														key={srv.serviceCode}
														serviceCode={srv.serviceCode}
														selectedSrvCode={selectedSrvCode}
														setSelectedSrvCode={setSelectedSrvCode}
														amount={srv.amount}
														speed={srv.speed}
													/>
												) )}
											</SimpleGrid>
										</Accordion.Panel>
									</Accordion.Item>
								</Accordion> : null
						}
					</Stack>
				</Paper>

				<TextInput
					icon={<IconPhone />}
					label="Agent/Customer Number"
					value={form.values.msisdn}
					onChange={event => form.setFieldValue( 'msisdn', event.currentTarget.value )}
					placeholder="Forexample 078..."
					error={form.errors.msisdn}
					withAsterisk
				/>

				<Flex mt="md" w="100%" gap={'sm'} justify={'flex-end'}>
					<Flex gap={'sm'} w="30%">
						<Button fullWidth onClick={() => mutation.mutate()}>
							{mutation.isLoading ? <Loader color="white" size={'xs'} /> : 'Load'}
						</Button>
						<Button fullWidth variant="light" onClick={() => form.reset()}>
							Reset
						</Button>
					</Flex>
				</Flex>
			</form>
		</Paper>
	)
} )
