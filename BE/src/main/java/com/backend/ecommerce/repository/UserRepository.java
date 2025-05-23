package com.backend.ecommerce.repository;


import com.backend.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByLink(String link);
    Optional<User> findById(Integer id);
    Optional<User> findByResetToken(String resetToken);
    List<User> findByCartIdDefault(Long cartIdDefault);

}
