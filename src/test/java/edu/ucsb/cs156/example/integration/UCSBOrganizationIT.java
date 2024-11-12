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

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;
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

public class UCSBOrganizationIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test

    public void test_that_logged_in_user_can_get_by_orgcode_when_the_orgcode_exists() throws Exception {
        // arrange
        UCSBOrganization org = UCSBOrganization.builder()
            .orgCode("AXO")
            .orgTranslationShort("ACHIO")
            .orgTranslation("ALPHA CHI OMEGA SORORITY")
            .inactive(true)
            .build();
        ucsbOrganizationRepository.save(org);
        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganization?orgCode=AXO"))
            .andExpect(status().isOk())
            .andReturn();
        // assert
        String expectedJson = mapper.writeValueAsString(org);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_org() throws Exception {
        // arrange
        UCSBOrganization org_new = UCSBOrganization.builder()
            .orgCode("AXO")
            .orgTranslationShort("ACHIO")
            .orgTranslation("ALPHACHIOMEGA")
            .inactive(true)
            .build();

        // act
        MvcResult response = mockMvc.perform(
            post("/api/ucsborganization/post?orgCode=AXO&orgTranslationShort=ACHIO&orgTranslation=ALPHACHIOMEGA&inactive=true")
                .with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(org_new);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }
}