package com.ug.portal.controller;

import com.ug.portal.model.LoginSession;
import com.ug.portal.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private StudentService studentService;
    
    @GetMapping("/logged-students")
    public ResponseEntity<Map<String, Object>> getLoggedStudents() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<LoginSession> activeSessions = studentService.getActiveLoginSessions();
            
            // Convert to response format
            List<Map<String, Object>> students = activeSessions.stream()
                .map(session -> {
                    Map<String, Object> student = new HashMap<>();
                    student.put("id", session.getId());
                    student.put("name", session.getName());
                    student.put("studentId", session.getStudentId());
                    student.put("email", session.getEmail());
                    student.put("loginTime", session.getLoginTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                    student.put("status", session.getSessionStatus());
                    return student;
                })
                .collect(Collectors.toList());
            
            response.put("success", true);
            response.put("students", students);
            response.put("total", students.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch logged students: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long activeSessionCount = studentService.getActiveSessionCount();
            long totalStudentCount = studentService.getTotalStudentCount();
            
            // Calculate today's logins
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("activeSessionCount", activeSessionCount);
            stats.put("totalStudentCount", totalStudentCount);
            stats.put("todayLoginCount", activeSessionCount); // Simplified for demo
            stats.put("systemStatus", "online");
            stats.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            response.put("success", true);
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch dashboard stats: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
