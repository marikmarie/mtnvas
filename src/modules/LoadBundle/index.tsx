import { Accordion, Paper, SimpleGrid, Text } from '@mantine/core';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Package } from './components/Package';

interface PackageData {
	serviceCode: string;
	amount: string;
	speed?: string;
	type: '4G' | '5G' | 'bundle';
	volume?: string;
}

const PACKAGES: Record<string, PackageData[]> = {
	wakanetSpeed4G: [
		{ type: '4G', serviceCode: 'FWA_3MBPS', amount: '55000', speed: '3MBPS' },
		{ type: '4G', serviceCode: 'FWA_5MBPS', amount: '85000', speed: '5MBPS' },
		{ type: '4G', serviceCode: 'FWA_10MBPS', amount: '130000', speed: '10MBPS' },
		{ type: '4G', serviceCode: 'FWA_20MBPS', amount: '195000', speed: '20MBPS' },
	],
	wakanetVolume4G: [
		{ type: '4G', serviceCode: 'FWA_50GB_4G_HOME', amount: '55000', volume: '50GB' },
		{ type: '4G', serviceCode: 'FWA_100GB_4G_HOME', amount: '85000', volume: '100GB' },
		{ type: '4G', serviceCode: 'FWA_160GB_4G_HOME', amount: '130000', volume: '160GB' },
		{ type: '4G', serviceCode: 'FWA_300GB_4G_HOME', amount: '195000', volume: '300GB' },
		{ type: '4G', serviceCode: 'FWA_900GB_4G_HOME', amount: '295000', volume: '900GB' },
	],
	wakanet5G: [
		{ type: '5G', serviceCode: 'FWAA_10MBPS', amount: '130000', speed: '10MBPS' },
		{ type: '5G', serviceCode: 'FWAA_20MBPS', amount: '195000', speed: '20MBPS' },
		{ type: '5G', serviceCode: 'FWA_40MBPS', amount: '295000', speed: '40MBPS' },
		{ type: '5G', serviceCode: 'FWA_60MBPS', amount: '395000', speed: '60MBPS' },
		{ type: '5G', serviceCode: 'FWA_80MBPS', amount: '495000', speed: '80MBPS' },
		{ type: '5G', serviceCode: 'FWA_100MBPS', amount: '595000', speed: '100MBPS' },
		{ type: '5G', serviceCode: 'FWA_150MBPS', amount: '695000', speed: '150MBPS' },
	],
	boosterPacks4G: [
		{ type: '4G', serviceCode: 'FWA_BST_3MBPS', amount: '1400', speed: '3MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_5MBPS', amount: '2500', speed: '5MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_10MBPS', amount: '3900', speed: '10MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_20MBPS', amount: '6300', speed: '20MBPS' },
	],
	boosterPacks5G: [
		{ type: '5G', serviceCode: 'FWAA_BST_10MBPS', amount: '4300', speed: '10MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_20MBPS', amount: '6500', speed: '20MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_40MBPS', amount: '9800', speed: '40MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_60MBPS', amount: '13100', speed: '60MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_80MBPS', amount: '16500', speed: '80MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_100MBPS', amount: '19800', speed: '100MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_150MBPS', amount: '23100', speed: '150MBPS' },
	],
	postPaidBundles: [
		{ type: 'bundle', serviceCode: 'Waka10PST', amount: '35000', volume: '14GB' },
		{ type: 'bundle', serviceCode: 'Waka20PST', amount: '55000', volume: '25GB' },
		{ type: 'bundle', serviceCode: 'Waka40PST', amount: '85000', volume: '45GB' },
		{ type: 'bundle', serviceCode: 'Waka85PST', amount: '170000', volume: '95GB' },
		{ type: 'bundle', serviceCode: 'Waka195PST', amount: '335000', volume: '195GB' },
	],
	volumeBundles: [
		{ type: 'bundle', serviceCode: '1778FHI5', amount: '35000', volume: '14GB' },
		{ type: 'bundle', serviceCode: '1778FHI4', amount: '55000', volume: '25GB' },
		{ type: 'bundle', serviceCode: '1778FHI1', amount: '85000', volume: '45GB + YoTv' },
		{ type: 'bundle', serviceCode: '1778FHI2', amount: '170000', volume: '95GB + YoTv' },
		{ type: 'bundle', serviceCode: '1778FHI3', amount: '335000', volume: '195GB + YoTv' },
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
								speed={srv.speed || ''}
								volume={srv.volume || ''}
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
					title="Wakanet speed 4G"
					packages={PACKAGES.wakanetSpeed4G}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Wakanet volume 4G"
					packages={PACKAGES.wakanetVolume4G}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Wakanet 5G"
					packages={PACKAGES.wakanet5G}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Booster Packs 4g"
					packages={PACKAGES.boosterPacks4G}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Booster Packs 5g"
					packages={PACKAGES.boosterPacks5G}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				<PackageSection
					title="Wakanet Router Volume bundles"
					packages={PACKAGES.volumeBundles}
					selectedSrvCode={selectedSrvCode}
					setSelectedSrvCode={setSelectedSrvCode}
				/>
				{user?.role === 'WAKA_CORP' && (
					<PackageSection
						title="PostPaid Bundles"
						packages={PACKAGES.postPaidBundles}
						selectedSrvCode={selectedSrvCode}
						setSelectedSrvCode={setSelectedSrvCode}
					/>
				)}
			</Paper>
		</Paper>
	);
};
