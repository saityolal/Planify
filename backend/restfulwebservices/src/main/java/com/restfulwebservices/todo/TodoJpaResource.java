package com.restfulwebservices.todo;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import jakarta.validation.Valid;
import java.util.List;

@RestController
public class TodoJpaResource {
    private final TodoRepository todoRepository;

    public TodoJpaResource(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;

    }

    @GetMapping("users/{username}/todos")
    public List<Todo> retrieveTodos(@PathVariable String username, Authentication authentication) {
        validateOwner(username, authentication);
        return todoRepository.findByUsername(username);
    }

    @GetMapping("users/{username}/todos/{id}")
    public Todo retrieveTodo(@PathVariable String username, @PathVariable int id, Authentication authentication) {
        validateOwner(username, authentication);
        return todoRepository.findByIdAndUsername(id, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found"));
    }

    @DeleteMapping("users/{username}/todos/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable String username, @PathVariable int id, Authentication authentication) {
        validateOwner(username, authentication);
        Todo todo = todoRepository.findByIdAndUsername(id, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found"));
        todoRepository.delete(todo);
        return ResponseEntity.noContent().build();

    }

    @PutMapping("users/{username}/todos/{id}")
    public Todo updateTodo(@PathVariable String username, @PathVariable int id, @Valid @RequestBody Todo todo, Authentication authentication) {
        validateOwner(username, authentication);
        todoRepository.findByIdAndUsername(id, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found"));
        todo.setId(id);
        todo.setUsername(username);
        todoRepository.save(todo);
        return todo;
    }

    @PostMapping("users/{username}/todos")
    public Todo createTodo(@PathVariable String username, @Valid @RequestBody Todo todo, Authentication authentication) {
        validateOwner(username, authentication);
        todo.setUsername(username);
        todo.setId(null);
        return todoRepository.save(todo);

    }

    private void validateOwner(String username, Authentication authentication) {
        if (authentication == null || !username.equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only access your own todos");
        }
    }
}
