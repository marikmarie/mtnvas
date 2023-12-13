import { Button, Flex, Paper, Stack, Text, TextInput } from '@mantine/core';
import React from 'react';

export default React.memo( function UpdateDetails() {
    return (
        <Paper p="lg" mt="xl" shadow='lg'>
            <Text fz="xl" fw="bold" c="dimmed" >
                Update Existing customer details
            </Text>

            <Stack mt={"sm"}>
                <TextInput label="WakaNet Number" placeholder="Forexample 2563945 ..." withAsterisk />
            </Stack>

            <Flex mt="md" w="100%" gap={"sm"} >
                <Button fullWidth variant="filled">Search User</Button>
            </Flex>
        </Paper>
    )
} )
