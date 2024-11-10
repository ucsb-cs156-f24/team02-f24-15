import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
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

  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // Arrange
      const cell = { row: { values: { id: 2 } } };

      // Act
      const result = cellToAxiosParamsDelete(cell);

      // Assert
      expect(result).toEqual({
        url: "/api/ucsbdiningcommonsmenuitem",
        method: "DELETE",
        params: { id: 2 },
      });
    });
  });

  test("It handles non-string messages (object with message property)", () => {
    // Arrange
    const restoreConsole = mockConsole();
    const messageObject = { message: "Menu item deleted successfully" };

    // Act
    onDeleteSuccess(messageObject);

    // Assert
    expect(toast.success).toHaveBeenCalledWith(
      "Menu item deleted successfully",
    );
    expect(console.log).toHaveBeenCalledWith(messageObject);

    restoreConsole();
  });
});
