import {
  Button,
  Container, Paper, SimpleGrid
} from "@mantine/core";
import React from "react";
import Layout from '../components/Layout';
import Signup from '../components/Signup';
import LoadBundle from '../components/LoadBundle';
import CheckBalance from '../components/CheckBalance';
import UpdateDetails from '../components/UpdateDetails';

type BTN_TYPE = "signup" | "load-bundle" | "check-balance" | "update-details"

export default React.memo( () => {

  const [activeBtn, setActiveBtn] = React.useState<BTN_TYPE>( "signup" )

  return (
    <Layout>
      <Container size={"xl"}>
        <Paper withBorder mt="md" p="sm">
          <SimpleGrid
            cols={4}
            breakpoints={[
              { maxWidth: 'md', cols: 2 },
              { maxWidth: 'xs', cols: 2 },
              { maxWidth: 'sm', cols: 2 },
            ]}
          >
            <Button
              fullWidth
              variant={activeBtn === "signup" ? "filled" : "light"}
              onClick={() => setActiveBtn( "signup" )}
            >
              Sign up
            </Button>
            <Button
              fullWidth
              variant={activeBtn === "load-bundle" ? "filled" : "light"}
              onClick={() => setActiveBtn( "load-bundle" )}
            >
              Load Bundle
            </Button>
            <Button
              fullWidth
              variant={activeBtn === "check-balance" ? "filled" : "light"}
              onClick={() => setActiveBtn( "check-balance" )}
            >
              Check Balance
            </Button>
            <Button
              fullWidth
              variant={activeBtn === "update-details" ? "filled" : "light"}
              onClick={() => setActiveBtn( "update-details" )}
            >
              Update Details
            </Button>
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
