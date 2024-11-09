import {
  onDeleteSuccess,
  rowToAxiosParamsDelete,
} from "main/utils/UCSBDiningCommonsMenuItemUtils";
import mockConsole from "jest-mock-console";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: {
      ...originalModule.toast,
      success: jest.fn(),
    },
  };
});

describe("UCSBDiningCommonsMenuItemUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      // Arrange
      const restoreConsole = mockConsole();

      // Act
      onDeleteSuccess("Menu item deleted successfully");

      // Assert
      expect(toast.success).toHaveBeenCalledWith(
        "Menu item deleted successfully",
      );
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("Menu item deleted successfully");

      restoreConsole();
    });
  });

  describe("rowToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // Arrange
      const row = { id: 2 };

      // Act
      const result = rowToAxiosParamsDelete(row);

      // Assert
      expect(result).toEqual({
        url: "/api/ucsbdiningcommonsmenuitem",
        method: "DELETE",
        params: { id: 2 },
      });
    });
  });
});
