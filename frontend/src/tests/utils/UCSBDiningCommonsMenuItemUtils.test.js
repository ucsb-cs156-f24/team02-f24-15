import {
  onDeleteSuccess,
  rowToAxiosParamsDelete,
} from "main/utils/UCSBDiningCommonsMenuItemUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("UCSBDiningCommonsMenuItemUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      // arrange
      const restoreConsole = mockConsole();

      // act
      onDeleteSuccess("Menu item deleted successfully");

      // assert
      expect(mockToast).toHaveBeenCalledWith("Menu item deleted successfully");
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("Menu item deleted successfully");

      restoreConsole();
    });
  });

  describe("rowToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // arrange
      const row = { id: 2 };

      // act
      const result = rowToAxiosParamsDelete(row);

      // assert
      expect(result).toEqual({
        url: "/api/ucsbdiningcommonsmenuitem",
        method: "DELETE",
        params: { id: 2 },
      });
    });
  });
});
