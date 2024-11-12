package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {

    @Test
    public void admin_user_can_create_edit_delete_menu_item() throws Exception {
        setupUser(true);

        // Navigate to UCSBDiningCommonsMenuItems
        page.getByText("UCSBDiningCommonsMenuItem").click();

        // Click the "Create UCSBDiningCommonsMenuItem" button
        page.getByText("Create UCSBDiningCommonsMenuItem").click();
        assertThat(page.getByText("Create UCSBDiningCommonsMenuItems")).isVisible();

        // Fill in form fields
        page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode").fill("test1");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("Sample Item");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Sample Station");

        // Submit the form
        page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

        // Verify that the new item appears in the table
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
                .hasText("Sample Item");

        // Edit the menu item
        page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit DiningCommonsMenuItem")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("Updated Item");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

        // Verify the update
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
                .hasText("Updated Item");

        // Delete the menu item
        page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button").click();

        // Verify that the item is no longer visible
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menu_item() throws Exception {
        setupUser(false);

        // Navigate to UCSBDiningCommonsMenuItems
        page.getByText("UCSBDiningCommonsMenuItem").click();

        // Ensure that the "Create UCSBDiningCommonsMenuItem" button is not visible
        assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).not().isVisible();
    }
}
