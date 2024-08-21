import { Accordion, Paper, SimpleGrid, Text } from '@mantine/core';
import { memo, useState } from 'react';
import { Package } from './components/Package';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';

interface PackageData {
	serviceCode: string;
	amount: string;
	speed: string;
	type: '4G' | '5G' | 'bundle';
}

const PACKAGES: Record<string, PackageData[]> = {
	wakanet_4g: [
		{ type: '4G', serviceCode: 'FWA_3MBPS', amount: '55000', speed: '3MBPS' },
		{ type: '4G', serviceCode: 'FWA_5MBPS', amount: '85000', speed: '5MBPS' },
		{ type: '4G', serviceCode: 'FWA_10MBPS', amount: '130000', speed: '10MBPS' },
		{ type: '4G', serviceCode: 'FWA_20MBPS', amount: '195000', speed: '20MBPS' },
	],
	wakanet_5g: [
		{ type: '5G', serviceCode: 'FWA_10MBPS', amount: '130000', speed: '10MBPS' },
		{ type: '5G', serviceCode: 'FWAA_10MBPS', amount: '130000', speed: '10MBPS' },
		{ type: '5G', serviceCode: 'FWAA_20MBPS', amount: '195000', speed: '20MBPS' },
		{ type: '5G', serviceCode: 'FWA_20MBPS', amount: '195000', speed: '20MBPS' },
		{ type: '5G', serviceCode: 'FWA_40MBPS', amount: '29500', speed: '40MBPS' },
		{ type: '5G', serviceCode: 'FWA_60MBPS', amount: '39500', speed: '60MBPS' },
		{ type: '5G', serviceCode: 'FWA_80MBPS', amount: '49500', speed: '80MBPS' },
		{ type: '5G', serviceCode: 'FWA_100MBPS', amount: '59500', speed: '100MBPS' },
		{ type: '5G', serviceCode: 'FWA_150MBPS', amount: '69500', speed: '150MBPS' },
	],
	booster_packs_4g: [
		{ type: '4G', serviceCode: 'FWA_BST_3MBPS', amount: '1400', speed: '3MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_5MBPS', amount: '2500', speed: '5MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_10MBPS', amount: '3900', speed: '10MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_20MBPS', amount: '6300', speed: '20MBPS' },
	],
	booster_packs_5g: [
		{ type: '5G', serviceCode: 'FWA_BST_10MBPS', amount: '4300', speed: '10MBPS' },
		{ type: '5G', serviceCode: 'FWA_BST_20MBPS', amount: '6500', speed: '20MBPS' },
		{ type: '5G', serviceCode: 'FWA_BST_40MBPS', amount: '9800', speed: '40MBPS' },
		{ type: '5G', serviceCode: 'FWA_BST_60MBPS', amount: '13100', speed: '60MBPS' },
		{ type: '5G', serviceCode: 'FWA_BST_80MBPS', amount: '16500', speed: '80MBPS' },
		{ type: '5G', serviceCode: 'FWA_BST_100MBPS', amount: '19800', speed: '100MBPS' },
		{ type: '5G', serviceCode: 'FWA_BST_150MBPS', amount: '23100', speed: '150MBPS' },
	],
	post_paid_bundles: [
		{ type: 'bundle', serviceCode: 'Waka10PST', amount: '35000', speed: '14GB' },
		{ type: 'bundle', serviceCode: 'Waka20PST', amount: '55000', speed: '25GB' },
		{ type: 'bundle', serviceCode: 'Waka40PST', amount: '85000', speed: '45GB' },
		{ type: 'bundle', serviceCode: 'Waka85PST', amount: '170000', speed: '95GB' },
		{ type: 'bundle', serviceCode: 'Waka195PST', amount: '335000', speed: '195GB' },
	],
	volume_bundles: [
		{ type: 'bundle', serviceCode: 'ITTH_14GB', amount: '35000', speed: '14GB' },
		{ type: 'bundle', serviceCode: 'ITTH_25GB', amount: '55000', speed: '25GB' },
		{ type: 'bundle', serviceCode: 'ITTH_45GB', amount: '85000', speed: '45GB' },
		{ type: 'bundle', serviceCode: 'ITTH_95GB', amount: '170000', speed: '95GB' },
		{ type: 'bundle', serviceCode: 'ITTH_195GB', amount: '335000', speed: '195GB' },
	],
};

interface PakageSelectionProps {
	title: string;
	packages: PackageData[];
	selectedSrvCode: string;
	setSelectedSrvCode: (code: string) => void;
}

const PackageSection = memo(
	({ title, packages, selectedSrvCode, setSelectedSrvCode }: PakageSelectionProps) => (
		<Accordion
			variant="filled"
			defaultValue={title.toLowerCase().replace(' ', '_')}
		>
			<Accordion.Item value={title.toLowerCase().replace(' ', '_')}>
				<Accordion.Control>
					<Text
						fz="xl"
						fw="bold"
						tt="uppercase"
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
								type={srv.type}
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

export default () => {
	const [selectedSrvCode, setSelectedSrvCode] = useState('');
	const user = useSelector((state: RootState) => state.auth.user);

	return (
		<Paper py="lg">
			<Paper my={'md'}>
				<PackageSection
					title="Wakanet 4G"
					packages={PACKAGES.wakanet_4g}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Wakanet 5G"
					packages={PACKAGES.wakanet_5g}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Booster Packs 4g"
					packages={PACKAGES.booster_packs_4g}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Booster Packs 5g"
					packages={PACKAGES.booster_packs_5g}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Wakanet Router Volume bundles"
					packages={PACKAGES.volume_bundles}
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
			</Paper>
		</Paper>
	);
};
