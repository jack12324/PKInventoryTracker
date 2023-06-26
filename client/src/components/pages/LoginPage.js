import { Heading, Link, Text } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import LoginForm from "../forms/LoginForm";

function LoginPage() {
  return (
    <section>
      <Heading>Log In</Heading>
      <Text>
        New here?{" "}
        <Link as={ReactLink} to="/signup">
          Sign up
        </Link>
      </Text>
      <LoginForm />
    </section>
  );
}

export default LoginPage;
