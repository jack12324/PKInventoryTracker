import { Heading, Link, Text } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import SignupForm from "../forms/SignupForm";

function SignupPage() {
  return (
    <section>
      <Heading>Sign Up</Heading>
      <Text>
        Already a user?{" "}
        <Link as={ReactLink} to="/login">
          Log in
        </Link>
      </Text>
      <SignupForm />
    </section>
  );
}

export default SignupPage;
