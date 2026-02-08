package com.example.purchase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LotDto {
    private Long id;
    
    @NotBlank(message = "Наименование лота обязательно")
    private String lotName;
    
    @NotBlank(message = "Код контрагента обязателен")
    private String customerCode;
    
    @NotNull(message = "Цена обязательна")
    @Positive(message = "Цена должна быть положительной")
    private BigDecimal price;
    
    @NotBlank(message = "Код валюты обязателен")
    private String currencyCode;
    
    @NotBlank(message = "Ставка НДС обязательна")
    private String ndsRate;
    
    private String placeDelivery;
    private LocalDateTime dateDelivery;
}
