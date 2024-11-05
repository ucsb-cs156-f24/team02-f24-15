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
      </QueryClientProvider>,
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
      </QueryClientProvider>,
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
      </QueryClientProvider>,
    );

    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Dining Commons Code is required/),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Name is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Station is required/)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
        </Router>
      </QueryClientProvider>,
    );

    const cancelButton = screen.getByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(-1);
    });
  });

  test("shows max length validation errors for all fields", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm submitAction={() => {}} />
        </Router>
      </QueryClientProvider>,
    );

    const diningCommonsCodeField = screen.getByTestId(
      `${testId}-diningCommonsCode`,
    );
    const nameField = screen.getByTestId(`${testId}-name`);
    const stationField = screen.getByTestId(`${testId}-station`);
    const submitButton = screen.getByText(/Create/);

    fireEvent.change(diningCommonsCodeField, {
      target: { value: "A".repeat(11) },
    }); // Exceeds max length of 10
    fireEvent.change(nameField, { target: { value: "A".repeat(51) } }); // Exceeds max length of 50
    fireEvent.change(stationField, { target: { value: "A".repeat(51) } }); // Exceeds max length of 50

    fireEvent.click(submitButton);

    // Wait for validation errors to appear individually
    expect(
      await screen.findByText(/Max length is 10 characters/),
    ).toBeInTheDocument();
    expect(
      await screen.findAllByText(/Max length is 50 characters/),
    ).toHaveLength(2);
  });

  test("renders correct data-testid attributes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm submitAction={() => {}} />
        </Router>
      </QueryClientProvider>,
    );

    expect(
      screen.getByTestId(`${testId}-diningCommonsCode`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-name`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-station`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-cancel`)).toBeInTheDocument();
  });
});
