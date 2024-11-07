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
    const menuItem = {
      id: 5,
      diningCommonsCode: "De La Guerra",
      name: "Taco Salad",
      station: "Mexican Grill",
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
    const nameInput = screen.getByLabelText("Name");
    const stationInput = screen.getByLabelText("Station");
    const createButton = screen.getByText("Create");

    fireEvent.change(codeInput, { target: { value: "De La Guerra" } });
    fireEvent.change(nameInput, { target: { value: "Taco Salad" } });
    fireEvent.change(stationInput, { target: { value: "Mexican Grill" } });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "De La Guerra",
      name: "Taco Salad",
      station: "Mexican Grill",
    });

    expect(mockToast).toBeCalledWith("New MenuItem Created - id: 5 name: Taco Salad");
    expect(mockNavigate).toBeCalledWith({ to: "/diningcommonsmenuitem" });
  });
});
