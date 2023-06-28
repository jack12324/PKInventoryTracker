import { Heading, Link, Text } from "@chakra-ui/react";
import { Link as ReactLink, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SignupForm from "../forms/SignupForm";

function SignupPage() {
  const user = useSelector((state) => state.user);
  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <Navigate to="/home" />
  ) : (
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
