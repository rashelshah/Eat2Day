package com.tastetrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Long restaurantId;
    private List<OrderItemRequest> items;
    private DeliveryRequest delivery;
    private PaymentRequest payment;
}
