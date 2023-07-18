import { Box, Center, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { Link as ReactLink, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SignupForm from "../forms/SignupForm";

function SignupPage() {
  const user = useSelector((state) => state.user);
  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <Navigate to="/home" />
  ) : (
    <Center bg="gray.50" h="100vh">
      <VStack maxW="xl" w="100%">
        <VStack pb={2}>
          <Heading>Sign Up</Heading>
          <Text>
            Already a user?{" "}
            <Link as={ReactLink} to="/login" color="link.400">
              Log in
            </Link>
          </Text>
        </VStack>
        <Box bg="white" rounded="lg" boxShadow="lg" w="90%" p={8}>
          <SignupForm />
        </Box>
      </VStack>
    </Center>
  );
}

export default SignupPage;
