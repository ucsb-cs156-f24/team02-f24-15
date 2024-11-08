import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({ storybook = false }) {
  const objectToAxiosParams = (menuItem) => ({
    url: "/api/ucsbdiningcommonmenuitem/post", // Updated URL
    method: "POST",
    params: {
      diningCommonsCode: menuItem.diningCommonsCode,
      name: menuItem.name,
      station: menuItem.station,
    },
  });

  const onSuccess = (menuItem) => {
    toast(`New MenuItem Created - id: ${menuItem.id} name: ${menuItem.name}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    ["/api/ucsbdiningcommonmenuitem/all"]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/diningcommonsmenuitem" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Dining Commons Menu Item</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
