import { useState, useEffect } from 'react';
import { Modal, Button, Stack, TextInput, Text, Group } from '@mantine/core';
import { faker } from '@faker-js/faker';
import { Imei } from './types';
import { showNotification } from '@mantine/notifications';

interface ImeiSwapModalProps {
	opened: boolean;
	onClose: () => void;
	imei: Imei | null;
	onSwap: (data: any) => Promise<void>;
}

const fakeAvailableImeis = Array.from({ length: 20 }, () => faker.phone.imei());
const fakeActiveImeis = Array.from({ length: 10 }, () => faker.phone.imei());

export function ImeiSwapModal({ opened, onClose, imei, onSwap }: ImeiSwapModalProps) {
	const [oldImei, setOldImei] = useState('');
	const [newImei, setNewImei] = useState('');
	const [reason, setReason] = useState('');
	const [checkResult, setCheckResult] = useState<string | null>(null);
	const [checking, setChecking] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setOldImei(imei?.imei || '');
		setNewImei('');
		setReason('');
		setCheckResult(null);
		setChecking(false);
		setLoading(false);
	}, [opened, imei]);

	const handleCheck = async () => {
		setChecking(true);
		setTimeout(() => {
			if (!fakeAvailableImeis.includes(newImei)) {
				setCheckResult('IMEI not available');
			} else if (!fakeActiveImeis.includes(newImei)) {
				setCheckResult('IMEI is available but not active');
			} else {
				setCheckResult('IMEI is available and active');
			}
			setChecking(false);
		}, 800);
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const response = await fetch('/api/imei/swap', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					oldImei,
					newImei,
					reason,
				}),
			});
			if (!response.ok) throw new Error('Swap failed');
			showNotification({
				color: 'green',
				title: 'Success',
				message: 'IMEI swapped successfully!',
			});
			await onSwap({ oldImei, newImei, reason });
			onClose();
		} catch (e: any) {
			showNotification({ color: 'red', title: 'Error', message: e.message || 'Swap failed' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`IMEI Swap${imei ? `: ${imei.imei}` : ''}`}
			centered
		>
			<Stack>
				<TextInput
					label="Old IMEI"
					placeholder="Enter old IMEI"
					value={oldImei}
					onChange={(e) => setOldImei(e.target.value)}
				/>
				<Group
					align="end"
					spacing="xs"
				>
					<TextInput
						label="New IMEI"
						placeholder="Enter new IMEI"
						value={newImei}
						onChange={(e) => setNewImei(e.target.value)}
						style={{ flex: 1 }}
					/>
					<Button
						onClick={handleCheck}
						loading={checking}
						disabled={!newImei}
						variant="outline"
					>
						Check
					</Button>
				</Group>
				{checkResult && (
					<Text
						color={checkResult.includes('not') ? 'red' : 'green'}
						size="sm"
					>
						{checkResult}
					</Text>
				)}
				<TextInput
					label="Reason for Swap"
					placeholder="Enter reason"
					value={reason}
					onChange={(e) => setReason(e.target.value)}
				/>
				<Button
					mt="md"
					onClick={handleSubmit}
					loading={loading}
					disabled={
						!(
							oldImei &&
							newImei &&
							reason &&
							checkResult === 'IMEI is available and active'
						)
					}
				>
					Swap
				</Button>
			</Stack>
		</Modal>
	);
}
