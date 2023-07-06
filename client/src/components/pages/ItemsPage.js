import {
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import Item from "../cards/Item";

function ItemsPage() {
  const allItems = useSelector((state) =>
    [...state.items].sort((a, b) => (a.name > b.name ? 1 : -1))
  );
  const [search, setSearch] = useState("");
  const items = search
    ? allItems.filter((i) => i.name.includes(search))
    : allItems;
  return (
    <>
      <Heading>Items</Heading>
      <InputGroup>
        <Input
          placeholder="Search for an item"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
        <InputRightElement>
          <SearchIcon color="gray.300" />
        </InputRightElement>
      </InputGroup>

      {items ? items.map((i) => <Item item={i} key={i.id} verbose />) : null}
    </>
  );
}

export default ItemsPage;
