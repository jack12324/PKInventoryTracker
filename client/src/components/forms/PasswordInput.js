import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";

function PasswordInput(props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup>
      <Input
        id="password"
        placeholder="Enter Password"
        type={showPassword ? "text" : "password"}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...props}
      />
      <InputRightElement>
        <Button onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default PasswordInput;
