package com.tastetrack.dto;

import com.tastetrack.entity.RestaurantApplication;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantApplicationResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String description;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime processedAt;
    private String processedBy;
    private String rejectionReason;

    public static RestaurantApplicationResponse fromEntity(RestaurantApplication application) {
        RestaurantApplicationResponse response = new RestaurantApplicationResponse();
        response.setId(application.getId());
        response.setName(application.getName());
        response.setEmail(application.getEmail());
        response.setPhone(application.getPhone());
        response.setAddress(application.getAddress());
        response.setDescription(application.getDescription());
        response.setStatus(application.getStatus().name());
        response.setSubmittedAt(application.getSubmittedAt());
        response.setProcessedAt(application.getProcessedAt());
        response.setProcessedBy(application.getProcessedBy());
        response.setRejectionReason(application.getRejectionReason());
        return response;
    }
}
