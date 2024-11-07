// src/main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable.js

import React from "react";
import OurTable from "main/components/OurTable";
import { Button } from "react-bootstrap";
import { useBackendMutation } from "main/utils/useBackend";
import {
  rowToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBDiningCommonsMenuItemUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBDiningCommonsMenuItemTable({
  menuItems,
  currentUser,
  testid = "UCSBDiningCommonsMenuItemTable",
}) {
  const navigate = useNavigate();

  const editCallback = (row) => {
    navigate(`/menuitem/edit/${row.id}`);
  };

  const deleteMutation = useBackendMutation(
    rowToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess }, // Needs test
    ["/api/ucsbdiningcommonsmenuitem/all"], // Needs test
  );

  const deleteCallback = async (row) => {
    deleteMutation.mutate(row);
  };

  function ButtonColumn(label, variant, callback, testid) {
    return {
      Header: label,
      id: label,
      accessor: (row) => row, // Return the entire row
      Cell: ({ cell }) => (
        <Button
          variant={variant}
          onClick={() => callback(cell.value)} // Use cell.value
          data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-button`}
        >
          {label}
        </Button>
      ),
    };
  }

  const columns = [
    {
      Header: "ID",
      accessor: "id", //needs test
    },
    {
      Header: "Dining Commons Code",
      accessor: "diningCommonsCode",
    },
    {
      Header: "Name",
      accessor: "name", //needs test
    },
    {
      Header: "Station",
      accessor: "station",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testid));
    columns.push(ButtonColumn("Delete", "danger", deleteCallback, testid));
  }

  return <OurTable data={menuItems} columns={columns} testid={testid} />;
}
