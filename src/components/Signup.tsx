import { Button, Flex, Paper, Stack, Text, TextInput } from '@mantine/core';
import { IconPhone } from '@tabler/icons-react';
import React from 'react';

export default React.memo( function Signup() {
    return (
        <Paper p="lg" mt="xl" shadow='lg'>
            <Text fz="xl" fw="bold" c="dimmed" >
                Sign up and Load free starter bundle
            </Text>

            <Stack mt={"sm"}>
                <TextInput icon={<IconPhone />} label="WakaNet Number" placeholder="Forexample 2563945 ..." withAsterisk />
            </Stack>

            <Flex mt="md" w="100%" gap={"sm"} >
                <Button fullWidth variant="filled">Signup</Button>
                <Button fullWidth variant="light">Reset</Button>
            </Flex>

        </Paper>
    )
} )
