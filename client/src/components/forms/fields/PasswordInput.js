import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

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
      <InputRightElement pr={2}>
        <IconButton
          onClick={() => setShowPassword(!showPassword)}
          h="80%"
          icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
          aria-label={showPassword ? "hide password" : "show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </IconButton>
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
