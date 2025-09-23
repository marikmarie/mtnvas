// src/features/Device/ViewDevices.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Button, Group, Text, Loader, ScrollArea } from '@mantine/core';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import useRequest from '../../hooks/useRequest';
import { Device } from '../Dealer/types';

interface ViewDevicesProps {
  onEdit: (device: Device) => void;
  onAdd?: () => void;
  showAddButton?: boolean;
}

export function ViewDevices({ onEdit, onAdd, showAddButton = true }: ViewDevicesProps) {
  const request = useRequest(true);

  const { data, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: () => request.get('/devices'),
    // keep previous data for smoother UI
    keepPreviousData: true,
  });

  const devices = (data?.data?.data ?? []) as Device[];

  if (isLoading) {
    return (
      <Group position="center" style={{ padding: 40 }}>
        <Loader />
      </Group>
    );
  }

  return (
    <div>
      <Group position="apart" mb="sm">
        <Text weight={600}>Devices</Text>
        {showAddButton && (
          <Button size="xs" leftIcon={<IconPlus size={14} />} onClick={onAdd}>
            Add Device
          </Button>
        )}
      </Group>

      <ScrollArea>
        <Table highlightOnHover striped verticalSpacing="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Price</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <Text align="center" color="dimmed" py="sm">No devices found.</Text>
                </td>
              </tr>
            )}

            {devices.map((d) => (
              <tr key={d.id}>
                <td>{d.deviceName}</td>
                <td>{d.deviceCategory}</td>
                <td>{d.description}</td>
                <td>{d.status}</td>
                <td>{d.price}</td>
                <td>
                  <Group spacing="xs">
                    <Button size="xs" variant="light" leftIcon={<IconEdit size={14} />} onClick={() => onEdit(d)}>
                      Edit
                    </Button>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}

export default ViewDevices;
