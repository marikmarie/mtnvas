import {
  Button,
  Container, Paper, SimpleGrid
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useAxios from "../hooks/use-axios";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import Layout from '../components/Layout';
import Signup from '../components/Signup';
import LoadBundle from '../components/LoadBundle';
import CheckBalance from '../components/CheckBalance';
import UpdateDetails from '../components/UpdateDetails';

type BTN_TYPE = "signup" | "load-bundle" | "check-balance" | "update-details"

export default React.memo( function AddUser() {
  const axios = useAxios();
  const navigate = useNavigate();

  const emailRgx = /^\S+@gdexperts\.com$/;
  const phoneRegex = /^256(78|77|76)\d{7}$/;

  const form = useForm( {
    initialValues: {
      emailAddress: "",
      phoneNumber: "",
      displayName: "",
      department: "",
      userName: "",
      jobTitle: "",
    },

    validate: {
      emailAddress: ( val ) => emailRgx.test( val )
        ? null
        : "Not a valid mtn or gdexperts email",
      userName: ( val ) =>
        val.length < 3 ? "Should be at least 3 characters" : null,
      displayName: ( val ) =>
        val.length < 3 ? "Should be at least 3 characters" : null,
      department: ( val ) =>
        val.length < 3 ? "Should be at least 3 characters" : null,
      jobTitle: ( val ) =>
        val.length < 3 ? "Should be at least 3 characters" : null,
      phoneNumber: ( val ) =>
        phoneRegex.test( val ) ? null : "Should be a valid MTN number",
    },
  } );

  useMutation( {
    mutationFn: ( data: string ) => axios.post( "", JSON.parse( data ) ),
    onSuccess: ( response: AxiosResponse ) => {
      notifications.show( {
        title: "SUCCESS",
        // @ts-ignore
        message: response?.message as unknown as React.ReactNode,
        color: "green",
        withCloseButton: true,
        autoClose: 5000,
      } );
      form.reset();
      navigate( "" );
    },
    onError: ( error: AxiosError ) => {
      notifications.show( {
        title: "ERROR",
        // @ts-ignore
        message: error.response?.data?.errors[0] as unknown as React.ReactNode,
        color: "red",
        withCloseButton: true,
        autoClose: 5000,
      } );
    },
  } );

  const [activeBtn, setActiveBtn] = React.useState<BTN_TYPE>( "signup" )

  return (
    <Layout>
      <Container size={"xl"}>
        <Paper shadow='lg' p="md">
          <SimpleGrid
            mt="md"
            cols={4}
            breakpoints={[
              { maxWidth: 'md', cols: 2 },
              { maxWidth: 'xs', cols: 2 },
              { maxWidth: 'sm', cols: 2 },
            ]}
          >
            <Button fullWidth variant={activeBtn === "signup" ? "filled" : "light"} onClick={() => setActiveBtn( "signup" )} >Sign up</Button>
            <Button fullWidth variant={activeBtn === "load-bundle" ? "filled" : "light"} onClick={() => setActiveBtn( "load-bundle" )} >Load Bundle</Button>
            <Button fullWidth variant={activeBtn === "check-balance" ? "filled" : "light"} onClick={() => setActiveBtn( "check-balance" )} >Check Balance</Button>
            <Button fullWidth variant={activeBtn === "update-details" ? "filled" : "light"} onClick={() => setActiveBtn( "update-details" )} >Update Details</Button>
          </SimpleGrid>
        </Paper>

        {
          ( () => {
            switch ( activeBtn ) {
              case "signup":
                return <Signup />;
              case "load-bundle":
                return <LoadBundle />;
              case "check-balance":
                return <CheckBalance />;
              case "update-details":
                return <UpdateDetails />;
              default:
                return null;
            }
          } )()
        }

      </Container>
    </Layout>
  );
} )
