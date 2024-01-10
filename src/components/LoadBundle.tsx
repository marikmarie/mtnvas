import { Button, Flex, Group, Paper, Radio, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPhone } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import React from 'react';
import useAxios from '../hooks/use-axios';

export default React.memo( () => {

    const axios = useAxios()

    const form = useForm( {
        initialValues: {
            msisdn: "",
            bnumber: "",
            Package: "",
        },

        validate: {
            bnumber: ( val: string ) => val.length > 9 ? null : "Should be a valid WakaNet Number",
            msisdn: ( val: string ) => val.length > 9 ? null : "Should be a valid custmer/agent number",
            Package: ( val: string ) => !val ? "Package is required" : null,
        },
    } );


    const mutation = useMutation( {
        mutationFn: () => axios.post( "/load-bundle", form.values ),
        onSuccess: ( _: AxiosResponse ) => {
            notifications.show( {
                title: "Success",
                message: JSON.stringify( _.data ),
                color: "green",
            } );
        },
        onError: ( error: AxiosError ) => {
            notifications.show( {
                title:
                    ( ( error.response?.data as { httpStatus: string } )
                        .httpStatus as unknown as React.ReactNode ) ||
                    ( (
                        error.response?.data as {
                            status: string;
                        }
                    ).status as unknown as React.ReactNode ),
                message:
                    ( (
                        error.response?.data as {
                            message: string;
                        }
                    ).message! as unknown as React.ReactNode ) ||
                    ( (
                        error.response?.data as {
                            error: string;
                        }
                    ).error as unknown as React.ReactNode ),
                color: "red",
            } );
        },
    } );

    return (
        <Paper p="lg" mt="xl" shadow='lg'>
            <Text
                fz="xl"
                fw="bold"
                c="dimmed" >
                Load new WakaNet bundle
            </Text>

            <form >
                <Stack mt={"sm"}>
                    <TextInput
                        icon={<IconPhone />}
                        label="WakaNet Number"
                        onChange={( event ) =>
                            form.setFieldValue( "bnumber", event.currentTarget.value )
                        }
                        error={form.errors.bnumber}
                        placeholder="Forexample 2563945..." withAsterisk />
                    <Radio.Group
                        name="Package"
                        withAsterisk
                        value={form.values.Package}
                        onChange={( value ) =>
                            form.setFieldValue( "Package", value )
                        }
                        error={form.errors.bnumber}
                    >
                        <Group mt="xs">
                            <Radio value="FWA_40MBPS" label="40MBPS" />
                            <Radio value="FWA_60MBPS" label="60MBPS" />
                            <Radio value="FWA_80MBPS" label="80MBPS" />
                            <Radio value="FWA_100MBPS" label="100MBPS" />
                            <Radio value="FWA_150MBPS" label="150MBPS" />
                        </Group>
                    </Radio.Group>
                    <TextInput icon={<IconPhone />} label="Agent/Customer Number" value={form.values.msisdn}
                        onChange={( event ) =>
                            form.setFieldValue( "msisdn", event.currentTarget.value )
                        }
                        placeholder="Forexample 2563945 ..." withAsterisk />
                </Stack>

                <Flex mt="md" w="100%" gap={"sm"} justify={"flex-end"}>
                    <Flex gap={"sm"} w="30%" >
                        <Button
                            fullWidth
                            variant="filled"
                            onClick={() => mutation.mutate()}
                        // onClick={() => console.log( form.values )}
                        >Signup</Button>
                        <Button
                            fullWidth
                            variant="light"
                            onClick={() => form.reset()} >Reset</Button>
                    </Flex>
                </Flex>
            </form>
        </Paper>
    )
} )
