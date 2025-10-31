package com.tastetrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationActionRequest {
    private String rejectionReason; // Optional, only for rejection
}
