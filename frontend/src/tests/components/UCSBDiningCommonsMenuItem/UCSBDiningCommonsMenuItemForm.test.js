import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  const queryClient = new QueryClient();

  const testId = "UCSBDiningCommonsMenuItemForm";

  test("renders correctly with no initialContents (create mode)", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm submitAction={() => {}} />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dining Commons Code/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Station/)).toBeInTheDocument();
  });

  test("renders correctly with initialContents (update mode)", async () => {
    const initialContents = {
      id: 1,
      diningCommonsCode: "DLG",
      name: "Burger",
      station: "Grill Station",
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm
            initialContents={initialContents}
            submitAction={() => {}}
            buttonLabel="Update"
          />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByDisplayValue("DLG")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Burger")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Grill Station")).toBeInTheDocument();
    expect(screen.getByText(/Update/)).toBeInTheDocument();
  });

  test("shows validation errors when fields are empty", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm submitAction={() => {}} />
        </Router>
      </QueryClientProvider>
    );

    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Dining Commons Code is required/);
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/Station is required/)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
        </Router>
      </QueryClientProvider>
    );

    const cancelButton = screen.getByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
