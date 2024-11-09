import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Dining Commons Code")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /diningcommonsmenuitem", async () => {
    const queryClient = new QueryClient();
    const menuItem = {
      id: 3,
      diningCommonsCode: "DCS",
      name: "Grilled Cheese",
      station: "Hot Station",
    };

    axiosMock.onPost("/api/ucsbdiningcommonmenuitem/post").reply(202, menuItem);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Dining Commons Code")).toBeInTheDocument();
    });

    const codeInput = screen.getByLabelText("Dining Commons Code");
    expect(codeInput).toBeInTheDocument();

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeInTheDocument();

    const stationInput = screen.getByLabelText("Station");
    expect(stationInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(codeInput, { target: { value: "DCS" } });
    fireEvent.change(nameInput, { target: { value: "Grilled Cheese" } });
    fireEvent.change(stationInput, { target: { value: "Hot Station" } });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "DCS",
      name: "Grilled Cheese",
      station: "Hot Station",
    });

    // Assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New UCSBDiningCommonsMenuItem Created - id: 3 name: Grilled Cheese",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/diningcommonsmenuitem" });
  });
});