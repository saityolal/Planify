package com.restfulwebservices.todo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Integer> {
    List<Todo> findByUsername(String username);

    Optional<Todo> findByIdAndUsername(Integer id, String username);

}
