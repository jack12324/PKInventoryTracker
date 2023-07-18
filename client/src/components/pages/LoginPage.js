import { Box, Center, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { Link as ReactLink, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "../forms/LoginForm";

function LoginPage() {
  const user = useSelector((state) => state.user);
  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <Navigate to="/items" />
  ) : (
    <Center bg="gray.50" h="100vh">
      <VStack maxW="xl" w="100%">
        <VStack pb={2}>
          <Heading>Log In</Heading>
          <Text>
            New here?{" "}
            <Link as={ReactLink} to="/signup" color="link.400">
              Sign up
            </Link>
          </Text>
        </VStack>
        <Box bg="white" rounded="lg" boxShadow="lg" w="90%" p={8}>
          <LoginForm />
        </Box>
      </VStack>
    </Center>
  );
}

export default LoginPage;
