import React from "react";
import UserTable from "./UserTable";
import users from "./users.json";
import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Company",
        accessor: "company",
      },
      {
        Header: "Sync",
        accessor: (rows) => (
          <Button onClick={() => console.log("ROWS: ", rows)}>Sync</Button>
        ),
      },
    ],
    []
  );

  return (
    <Box pr="10rem" pl="10rem">
      <UserTable data={users} columns={columns} />
    </Box>
  );
}

export default App;
