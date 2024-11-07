import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function rowToAxiosParamsDelete(row) {
  return {
    url: "/api/ucsbdiningcommonsmenuitem",
    method: "DELETE",
    params: {
      id: row.id,
    },
  };
}
