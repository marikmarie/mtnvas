import { Accordion, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { memo, useState } from 'react';
import { Package } from './components/Package';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';

export default memo(() => {
	const [selectedSrvCode, setSelectedSrvCode] = useState('');

	const wakanet_5g = [
		// Preceeded the serviceCode with a -5G to distinguish it from a similar bundle in the 4G packages. I then remove it when making a network request so that server recieves the correct serviceCode
		{ serviceCode: 'FWA_10MBPS-5G', amount: '130000UGX', speed: '10MBPS' },
		{ serviceCode: 'FWA_20MBPS-5G', amount: '195000UGX', speed: '20MBPS' },
		{ serviceCode: 'FWA_40MBPS', amount: '29500UGX', speed: '40MBPS' },
		{ serviceCode: 'FWA_60MBPS', amount: '39500UGX', speed: '60MBPS' },
		{ serviceCode: 'FWA_80MBPS', amount: '49500UGX', speed: '80MBPS' },
		{ serviceCode: 'FWA_100MBPS', amount: '59500UGX', speed: '100MBPS' },
		{ serviceCode: 'FWA_150MBPS', amount: '69500UGX', speed: '150MBPS' },
	];

	const wakanet_4g = [
		{ serviceCode: 'FWA_3MBPS', amount: '55000UGX', speed: '3MBPS' },
		{ serviceCode: 'FWA_5MBPS', amount: '85000UGX', speed: '5MBPS' },
		// Preceeded the serviceCode with a -4G to distinguish it from a similar bundle in the 4G packages. I then remove it when making a network request so that server recieves the correct serviceCode
		{ serviceCode: 'FWA_10MBPS-4G', amount: '130000UGX', speed: '10MBPS' },
		{ serviceCode: 'FWA_20MBPS-4G', amount: '195000UGX', speed: '20MBPS' },
	];

	const wakanet_bundles = [
		{ serviceCode: 'ITTH_14GB', amount: '35000UGX', speed: '14GB' },
		{ serviceCode: '1778FHI4', amount: '55000UGX', speed: '25GB' },
		{ serviceCode: '1778FHI1', amount: '85000UGX', speed: '45GB' },
		{ serviceCode: '1778FHI2', amount: '170000UGX', speed: '95GB' },
		{ serviceCode: '1778FHI3', amount: '335000UGX', speed: '195GB' },
	];

	const post_paid_bundles = [
		{ serviceCode: 'Waka10PST', amount: '35000UGX', speed: '14GB' },
		{ serviceCode: 'Waka20PST', amount: '55000UGX', speed: '25GB' },
		{ serviceCode: 'Waka40PST', amount: '85000UGX', speed: '45GB' },
		{ serviceCode: 'Waka85PST', amount: '170000UGX', speed: '95GB' },
		{ serviceCode: 'Waka195PST', amount: '335000UGX', speed: '195GB' },
	];

	const user = useSelector((state: RootState) => state.auth.user);

	return (
		<Paper py="lg">
			<Text
				fz="xl"
				fw="bold"
			>
				Load new 5G bundle
			</Text>

			<Paper my={'md'}>
				<Stack>
					<Accordion
						variant="contained"
						defaultValue={'wakanet_5g'}
					>
						<Accordion.Item value="wakanet_5g">
							<Accordion.Control>
								<Text
									fz="xl"
									fw="bold"
								>
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
									{wakanet_5g.map((srv) => (
										<Package
											selectedSrvCode={selectedSrvCode}
											key={srv.serviceCode}
											serviceCode={srv.serviceCode}
											setSelectedSrvCode={setSelectedSrvCode}
											amount={srv.amount}
											speed={srv.speed}
										/>
									))}
								</SimpleGrid>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
					<Accordion
						variant="contained"
						defaultValue={'wakanet_4g'}
					>
						<Accordion.Item value="wakanet_4g">
							<Accordion.Control>
								<Text
									fz="xl"
									fw="bold"
								>
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
									{wakanet_4g.map((srv) => (
										<Package
											key={srv.serviceCode}
											serviceCode={srv.serviceCode}
											selectedSrvCode={selectedSrvCode}
											setSelectedSrvCode={setSelectedSrvCode}
											amount={srv.amount}
											speed={srv.speed}
										/>
									))}
								</SimpleGrid>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
					<Accordion
						variant="contained"
						defaultValue={'wakanet_bundles'}
					>
						<Accordion.Item value="wakanet_bundles">
							<Accordion.Control>
								<Text
									fz="xl"
									fw="bold"
								>
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
									{wakanet_bundles.map((srv) => (
										<Package
											key={srv.serviceCode}
											serviceCode={srv.serviceCode}
											selectedSrvCode={selectedSrvCode}
											setSelectedSrvCode={setSelectedSrvCode}
											amount={srv.amount}
											speed={srv.speed}
										/>
									))}
								</SimpleGrid>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
					{user?.role === 'WAKA_CORP' ? (
						<Accordion
							variant="contained"
							defaultValue={'wakanet_bundles'}
						>
							<Accordion.Item value="wakanet_bundles">
								<Accordion.Control>
									<Text
										fz="xl"
										fw="bold"
									>
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
										{post_paid_bundles.map((srv) => (
											<Package
												key={srv.serviceCode}
												serviceCode={srv.serviceCode}
												selectedSrvCode={selectedSrvCode}
												setSelectedSrvCode={setSelectedSrvCode}
												amount={srv.amount}
												speed={srv.speed}
											/>
										))}
									</SimpleGrid>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					) : null}
				</Stack>
			</Paper>
		</Paper>
	);
});
