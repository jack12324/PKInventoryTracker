import { Heading, Link, Text } from "@chakra-ui/react";
import { Link as ReactLink, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "../forms/LoginForm";

function LoginPage() {
  const user = useSelector((state) => state.user);
  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <Navigate to="/home" />
  ) : (
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
