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
public class HelpRequestWebIT extends WebTestCase {

   @Test
    public void admin_user_can_create_edit_delete_helpRequest() throws Exception {
        setupUser(true);
        page.setDefaultTimeout(60000);

        page.waitForLoadState();
        assertThat(page.getByText("HelpRequest")).isVisible();
        page.getByText("HelpRequest").click();


        page.getByText("Create HelpRequest").click();
        assertThat(page.getByText("Create New HelpRequest")).isVisible();
        
        page.getByTestId("HelpRequestForm-requesterEmail").fill("test@example.com");
        page.getByTestId("HelpRequestForm-teamId").fill("team03");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("Room 101");
        page.getByTestId("HelpRequestForm-requestTime").fill("2024-11-12T10:15");
        page.getByTestId("HelpRequestForm-explanation").fill("Need help with testing.");
        page.getByTestId("HelpRequestForm-solved").check();
        page.getByTestId("HelpRequestForm-submit").click();


        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("test@example.com");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
                .hasText("Need help with testing.");


        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit HelpRequest")).isVisible();
        page.getByTestId("HelpRequestForm-explanation").fill("Updated explanation");
        page.getByTestId("HelpRequestForm-submit").click();


        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
                .hasText("Updated explanation");


        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_helpRequest() throws Exception {
        setupUser(false);
        page.setDefaultTimeout(60000);

        page.waitForLoadState();
        assertThat(page.getByText("HelpRequest")).isVisible();
        page.getByText("HelpRequest").click();


        assertThat(page.getByText("Create HelpRequest")).not().isVisible();
    }
}
