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
public class ArticleWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        page.getByText("Create Articles").click();
        assertThat(page.getByText("Create New Article")).isVisible();
        page.getByTestId("ArticlesForm-title").fill("Article");
        page.getByTestId("ArticlesForm-url").fill("Article.com");
        page.getByTestId("ArticlesForm-explanation").fill("none");
        page.getByTestId("ArticlesForm-email").fill("student@ucsb.edu");
        page.getByTestId("ArticlesForm-dateAdded").fill("2024-11-11T10:39");
        page.getByTestId("ArticlesForm-submit").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation"))
                .hasText("none");

        page.getByTestId("ArticlesTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Article")).isVisible();
        page.getByTestId("ArticlesForm-explanation").fill("The best article ever");
        page.getByTestId("ArticlesForm-submit").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation")).hasText("The best article ever");

        page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Articles")).not().isVisible();
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
    }
}