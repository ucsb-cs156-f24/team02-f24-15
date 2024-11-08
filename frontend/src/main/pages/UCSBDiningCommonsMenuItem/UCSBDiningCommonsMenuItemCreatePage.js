import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

function UCSBDiningCommonsMenuItemCreatePage({ storybook = false }) {
  const objectToAxiosParams = (item) => ({
    url: "/api/ucsbdiningcommonmenuitem/post",
    method: "POST",
    params: {
      diningCommonsCode: item.diningCommonsCode,
      name: item.name,
      station: item.station,
    },
  });

  const onSuccess = (data) => {
    console.log("Server response data:", data); // Debugging line
    toast(`New UCSBDiningCommonsMenuItem Created - id: ${data.id} name: ${data.name}`);
    if (!storybook) {
      return <Navigate to="/diningcommonsmenuitem" />;
    }
  };
  

  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSB Dining Commons Menu Item</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}

export default UCSBDiningCommonsMenuItemCreatePage;
