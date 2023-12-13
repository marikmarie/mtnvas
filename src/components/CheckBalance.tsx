import { Button, Flex, Paper, Stack, Text, TextInput } from '@mantine/core';
import React from 'react';

export default React.memo( function CheckBalance() {
    return (
        <Paper p="lg" mt="xl" shadow='lg'>
            <Text fz="xl" fw="bold" c="dimmed" >
                Check Customer Subscription balance
            </Text>

            <Stack mt={"sm"}>
                <TextInput label="WakaNet Number" placeholder="Forexample 2563945 ..." withAsterisk />
            </Stack>

            <Flex mt="md" w="100%" gap={"sm"} >
                <Button fullWidth variant="light">Reset</Button>
                <Button fullWidth variant="filled">Check Balance</Button>
            </Flex>
        </Paper>
    )
} )
