package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    @Autowired
    private ObjectMapper mapper;

    @MockBean
    private UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_logged_in_user_can_get_menu_item_by_id_when_id_exists() throws Exception {
        // Arrange
        UCSBDiningCommonsMenuItem menuItem = UCSBDiningCommonsMenuItem.builder()
            .diningCommonsCode("DLG")
            .name("Cheeseburger")
            .station("Grill")
            .build();
        ucsbDiningCommonsMenuItemRepository.save(menuItem);

        // Act
        MvcResult response = mockMvc.perform(get("/api/ucsbdiningcommonsmenuitem?id=" + menuItem.getId()))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        String expectedJson = mapper.writeValueAsString(menuItem);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void test_admin_user_can_post_new_menu_item() throws Exception {
        // Arrange
        UCSBDiningCommonsMenuItem menuItem1 = UCSBDiningCommonsMenuItem.builder()
            .id(1L)
            .diningCommonsCode("Portola")
            .name("Salmon")
            .station("Seafood Station")
            .build();

        // Act
        MvcResult response = mockMvc.perform(
            post("/api/ucsbdiningcommonsmenuitem/post?diningCommonsCode=Portola&name=Salmon&station=Seafood Station")
                .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        String expectedJson = mapper.writeValueAsString(menuItem1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }
}
