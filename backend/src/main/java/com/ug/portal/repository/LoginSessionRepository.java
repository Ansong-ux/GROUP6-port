package com.ug.portal.repository;

import com.ug.portal.model.LoginSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginSessionRepository extends JpaRepository<LoginSession, Long> {
    List<LoginSession> findBySessionStatusOrderByLoginTimeDesc(String sessionStatus);
    
    @Query("SELECT ls FROM LoginSession ls WHERE ls.sessionStatus = 'active' ORDER BY ls.loginTime DESC")
    List<LoginSession> findActiveSessionsOrderByLoginTime();
    
    @Query("SELECT COUNT(ls) FROM LoginSession ls WHERE ls.sessionStatus = 'active'")
    long countActiveSessions();
    
    @Query("SELECT COUNT(ls) FROM LoginSession ls WHERE ls.loginTime >= :startDate AND ls.loginTime <= :endDate")
    long countLoginsBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    List<LoginSession> findByStudentIdOrderByLoginTimeDesc(String studentId);
}
