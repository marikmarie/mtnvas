import { Accordion, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { memo, useState } from 'react';
import { Package } from './components/Package';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';

interface PackageData {
	serviceCode: string;
	amount: string;
	speed: string;
}

const PACKAGES: Record<string, PackageData[]> = {
	wakanet_5g: [
		{ serviceCode: 'FWA_10MBPS-5G', amount: '130000UGX', speed: '10MBPS' },
		{ serviceCode: 'FWA_20MBPS-5G', amount: '195000UGX', speed: '20MBPS' },
		{ serviceCode: 'FWA_40MBPS', amount: '29500UGX', speed: '40MBPS' },
		{ serviceCode: 'FWA_60MBPS', amount: '39500UGX', speed: '60MBPS' },
		{ serviceCode: 'FWA_80MBPS', amount: '49500UGX', speed: '80MBPS' },
		{ serviceCode: 'FWA_100MBPS', amount: '59500UGX', speed: '100MBPS' },
		{ serviceCode: 'FWA_150MBPS', amount: '69500UGX', speed: '150MBPS' },
	],
	wakanet_4g: [
		{ serviceCode: 'FWA_3MBPS', amount: '55000UGX', speed: '3MBPS' },
		{ serviceCode: 'FWA_5MBPS', amount: '85000UGX', speed: '5MBPS' },
		{ serviceCode: 'FWA_10MBPS-4G', amount: '130000UGX', speed: '10MBPS' },
		{ serviceCode: 'FWA_20MBPS-4G', amount: '195000UGX', speed: '20MBPS' },
	],
	booster_packs: [
		{ serviceCode: 'Waka10PST', amount: '35000UGX', speed: '14GB' },
		{ serviceCode: 'Waka20PST', amount: '55000UGX', speed: '25GB' },
		{ serviceCode: 'Waka40PST', amount: '85000UGX', speed: '45GB' },
		{ serviceCode: 'Waka85PST', amount: '170000UGX', speed: '95GB' },
		{ serviceCode: 'Waka195PST', amount: '335000UGX', speed: '195GB' },
	],
	post_paid_bundles: [
		{ serviceCode: 'Waka10PST', amount: '35000UGX', speed: '14GB' },
		{ serviceCode: 'Waka20PST', amount: '55000UGX', speed: '25GB' },
		{ serviceCode: 'Waka40PST', amount: '85000UGX', speed: '45GB' },
		{ serviceCode: 'Waka85PST', amount: '170000UGX', speed: '95GB' },
		{ serviceCode: 'Waka195PST', amount: '335000UGX', speed: '195GB' },
	],
};

const PackageSection = memo(
	({
		title,
		packages,
		selectedSrvCode,
		setSelectedSrvCode,
	}: {
		title: string;
		packages: PackageData[];
		selectedSrvCode: string;
		setSelectedSrvCode: (code: string) => void;
	}) => (
		<Accordion
			variant="contained"
			defaultValue={title.toLowerCase().replace(' ', '_')}
		>
			<Accordion.Item value={title.toLowerCase().replace(' ', '_')}>
				<Accordion.Control>
					<Text
						fz="xl"
						fw="bold"
					>
						{title}
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
						{packages.map((srv) => (
							<Package
								key={srv.serviceCode}
								selectedSrvCode={selectedSrvCode}
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
	)
);

export default memo(() => {
	const [selectedSrvCode, setSelectedSrvCode] = useState('');
	const user = useSelector((state: RootState) => state.auth.user);

	return (
		<Paper py="lg">
			<Paper my={'md'}>
				<Stack>
					<PackageSection
						title="Wakanet 5G"
						packages={PACKAGES.wakanet_5g}
						selectedSrvCode={selectedSrvCode}
						setSelectedSrvCode={setSelectedSrvCode}
					/>
					<PackageSection
						title="Wakanet 4G"
						packages={PACKAGES.wakanet_4g}
						selectedSrvCode={selectedSrvCode}
						setSelectedSrvCode={setSelectedSrvCode}
					/>
					<PackageSection
						title="Booster Packs"
						packages={PACKAGES.booster_packs}
						selectedSrvCode={selectedSrvCode}
						setSelectedSrvCode={setSelectedSrvCode}
					/>
					{user?.role === 'WAKA_CORP' && (
						<PackageSection
							title="PostPaid Bundles"
							packages={PACKAGES.post_paid_bundles}
							selectedSrvCode={selectedSrvCode}
							setSelectedSrvCode={setSelectedSrvCode}
						/>
					)}
				</Stack>
			</Paper>
		</Paper>
	);
});
