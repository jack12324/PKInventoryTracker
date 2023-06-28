import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";

function PasswordInput({ options, register }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <Input
        id="password"
        placeholder="Enter Password"
        type={showPassword ? "text" : "password"}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...register("password", options)}
      />
      <InputRightElement>
        <Button onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

PasswordInput.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
};

export default PasswordInput;
