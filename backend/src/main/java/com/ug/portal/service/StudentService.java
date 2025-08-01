package com.ug.portal.service;

import com.ug.portal.model.Student;
import com.ug.portal.model.LoginSession;
import com.ug.portal.repository.StudentRepository;
import com.ug.portal.repository.LoginSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private LoginSessionRepository loginSessionRepository;
    
    public Student saveOrUpdateStudent(String name, String studentId, String email) {
        Optional<Student> existingStudent = studentRepository.findByStudentId(studentId);
        
        if (existingStudent.isPresent()) {
            Student student = existingStudent.get();
            student.setName(name);
            student.setEmail(email);
            return studentRepository.save(student);
        } else {
            Student newStudent = new Student(name, studentId, email);
            return studentRepository.save(newStudent);
        }
    }
    
    public LoginSession recordLogin(String name, String studentId, String email, String ipAddress, String userAgent) {
        // First, save or update the student
        saveOrUpdateStudent(name, studentId, email);
        
        // Then record the login session
        LoginSession session = new LoginSession(studentId, name, email, ipAddress, userAgent);
        return loginSessionRepository.save(session);
    }
    
    public List<LoginSession> getActiveLoginSessions() {
        return loginSessionRepository.findActiveSessionsOrderByLoginTime();
    }
    
    public long getActiveSessionCount() {
        return loginSessionRepository.countActiveSessions();
    }
    
    public long getTotalStudentCount() {
        return studentRepository.countTotalStudents();
    }
    
    public Optional<Student> findByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }
    
    public boolean existsByStudentId(String studentId) {
        return studentRepository.existsByStudentId(studentId);
    }
    
    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }
}
