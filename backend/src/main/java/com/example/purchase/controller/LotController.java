package com.example.purchase.controller;

import com.example.purchase.dto.LotDto;
import com.example.purchase.jooq.tables.records.LotRecord;
import com.example.purchase.service.LotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lots")
@RequiredArgsConstructor
@CrossOrigin
public class LotController {
    
    private final LotService lotService;
    
    @GetMapping
    public ResponseEntity<List<LotRecord>> getAll() {
        return ResponseEntity.ok(lotService.findAll());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<LotRecord>> search(
            @RequestParam(required = false) String lotName,
            @RequestParam(required = false) String customerCode,
            @RequestParam(required = false) String currencyCode) {
        return ResponseEntity.ok(lotService.search(lotName, customerCode, currencyCode));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LotRecord> getById(@PathVariable Long id) {
        LotRecord lot = lotService.findById(id);
        if (lot == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lot);
    }
    
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody LotDto dto) {
        try {
            LotRecord created = lotService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody LotDto dto) {
        try {
            LotRecord updated = lotService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            lotService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
