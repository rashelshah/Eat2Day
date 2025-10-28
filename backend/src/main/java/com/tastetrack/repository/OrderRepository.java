package com.tastetrack.repository;

import com.tastetrack.entity.Order;
import com.tastetrack.entity.Order.OrderStatus;
import com.tastetrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.restaurant " +
           "LEFT JOIN FETCH o.items oi " +
           "LEFT JOIN FETCH oi.menuItem " +
           "WHERE o.user.id = :userId " +
           "ORDER BY o.orderDate DESC")
    List<Order> findByUserIdOrderByOrderDateDesc(@Param("userId") Long userId);

    List<Order> findByStatus(OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.user = :user AND o.status IN :statuses")
    List<Order> findByUserAndStatusIn(User user, List<OrderStatus> statuses);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.restaurant " +
           "LEFT JOIN FETCH o.items oi " +
           "LEFT JOIN FETCH oi.menuItem " +
           "WHERE o.orderNumber = :orderNumber")
    Optional<Order> findByOrderNumber(@Param("orderNumber") String orderNumber);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.restaurant " +
           "LEFT JOIN FETCH o.items oi " +
           "LEFT JOIN FETCH oi.menuItem " +
           "WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") Long id);
}
