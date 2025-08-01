package com.ug.portal.repository;

import com.ug.portal.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByEmail(String email);
    boolean existsByStudentId(String studentId);
    boolean existsByEmail(String email);
    
    @Query("SELECT COUNT(s) FROM Student s")
    long countTotalStudents();
}
