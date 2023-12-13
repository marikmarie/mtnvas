import { Button, Flex, Group, Paper, Radio, Stack, Text, TextInput } from '@mantine/core';
import { IconPhone } from '@tabler/icons-react';
import React from 'react';

export default React.memo( function LoadBundle() {
    return (
        <Paper p="lg" mt="xl" shadow='lg'>
            <Text fz="xl" fw="bold" c="dimmed" >
                Load new WakaNet bundle
            </Text>

            <Stack mt={"sm"}>
                <TextInput icon={<IconPhone />} label="WakaNet Number" placeholder="Forexample 2563945 ..." withAsterisk />
                <Radio.Group
                    name="bundle"
                    withAsterisk
                >
                    <Group mt="xs">
                        <Radio value="10GB" label="10GB" />
                        <Radio value="25GB" label="25GB" />
                        <Radio value="45GB" label="45GB" />
                        <Radio value="95GB" label="95GB" />
                        <Radio value="195GB" label="195GB" />
                    </Group>
                </Radio.Group>
                <TextInput icon={<IconPhone />} label="Agent/Customer Number" placeholder="Forexample 2563945 ..." withAsterisk />
            </Stack>

            <Flex mt="md" w="100%" gap={"sm"} >
                <Button fullWidth variant="filled">Signup</Button>
                <Button fullWidth variant="light">Reset</Button>
            </Flex>

        </Paper>
    )
} )
