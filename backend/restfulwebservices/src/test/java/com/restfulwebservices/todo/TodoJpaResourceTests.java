package com.restfulwebservices.todo;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TodoJpaResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void authenticateReturnsJwtToken() throws Exception {
        mockMvc.perform(post("/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"admin","password":"admin"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void retrieveTodosRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/users/admin/todos"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void retrieveOwnTodosReturnsSeededTodos() throws Exception {
        mockMvc.perform(get("/users/admin/todos")
                        .header("Authorization", "Bearer " + token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThan(0)))
                .andExpect(jsonPath("$[0].username", is("admin")));
    }

    @Test
    void retrieveOtherUsersTodosIsForbidden() throws Exception {
        mockMvc.perform(get("/users/other/todos")
                        .header("Authorization", "Bearer " + token()))
                .andExpect(status().isForbidden());
    }

    @Test
    void retrieveMissingTodoReturnsNotFound() throws Exception {
        mockMvc.perform(get("/users/admin/todos/999")
                        .header("Authorization", "Bearer " + token()))
                .andExpect(status().isNotFound());
    }

    @Test
    void createTodoValidatesRequestBody() throws Exception {
        mockMvc.perform(post("/users/admin/todos")
                        .header("Authorization", "Bearer " + token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "description": "bad",
                                  "targetDate": "2000-01-01",
                                  "done": false,
                                  "priority": "URGENT",
                                  "category": "Learning"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    private String token() throws Exception {
        String response = mockMvc.perform(post("/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"admin","password":"admin"}
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return response.substring(response.indexOf(":\"") + 2, response.lastIndexOf("\""));
    }
}
