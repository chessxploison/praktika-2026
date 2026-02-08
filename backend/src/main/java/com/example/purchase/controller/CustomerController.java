package com.example.purchase.controller;

import com.example.purchase.dto.CustomerDto;
import com.example.purchase.jooq.tables.records.CustomerRecord;
import com.example.purchase.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerController {
    
    private final CustomerService customerService;
    
    @GetMapping
    public ResponseEntity<List<CustomerRecord>> getAll() {
        return ResponseEntity.ok(customerService.findAll());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<CustomerRecord>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String inn,
            @RequestParam(required = false) Boolean isOrganization) {
        return ResponseEntity.ok(customerService.search(name, inn, isOrganization));
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<CustomerRecord> getByCode(@PathVariable String code) {
        CustomerRecord customer = customerService.findByCode(code);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }
    
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CustomerDto dto) {
        try {
            CustomerRecord created = customerService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{code}")
    public ResponseEntity<?> update(
            @PathVariable String code,
            @Valid @RequestBody CustomerDto dto) {
        try {
            CustomerRecord updated = customerService.update(code, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        try {
            customerService.delete(code);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
