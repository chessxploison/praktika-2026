package com.example.purchase.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CustomerDto {
    @NotBlank(message = "Код контрагента обязателен")
    private String customerCode;
    
    @NotBlank(message = "Наименование обязательно")
    private String customerName;
    
    @Pattern(regexp = "\\d{10}|\\d{12}|^$", message = "ИНН должен содержать 10 или 12 цифр")
    private String customerInn;
    
    @Pattern(regexp = "\\d{9}|^$", message = "КПП должен содержать 9 цифр")
    private String customerKpp;
    
    private String customerLegalAddress;
    private String customerPostalAddress;
    
    @Email(message = "Неверный формат email")
    private String customerEmail;
    
    private String customerCodeMain;
    private Boolean isOrganization = false;
    private Boolean isPerson = false;
}
