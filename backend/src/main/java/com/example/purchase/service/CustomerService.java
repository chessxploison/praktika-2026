package com.example.purchase.service;

import com.example.purchase.dto.CustomerDto;
import com.example.purchase.jooq.tables.records.CustomerRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.purchase.jooq.Tables.CUSTOMER;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {
    
    private final DSLContext dsl;
    
    public List<CustomerRecord> findAll() {
        return dsl.selectFrom(CUSTOMER)
                .orderBy(CUSTOMER.CUSTOMER_NAME)
                .fetchInto(CustomerRecord.class);
    }
    
    public CustomerRecord findByCode(String code) {
        return dsl.selectFrom(CUSTOMER)
                .where(CUSTOMER.CUSTOMER_CODE.eq(code))
                .fetchOne();
    }
    
    @Transactional
    public CustomerRecord create(CustomerDto dto) {
        if (findByCode(dto.getCustomerCode()) != null) {
            throw new RuntimeException("Контрагент с кодом " + dto.getCustomerCode() + " уже существует");
        }
        
        CustomerRecord record = dsl.newRecord(CUSTOMER);
        record.setCustomerCode(dto.getCustomerCode());
        record.setCustomerName(dto.getCustomerName());
        record.setCustomerInn(dto.getCustomerInn());
        record.setCustomerKpp(dto.getCustomerKpp());
        record.setCustomerLegalAddress(dto.getCustomerLegalAddress());
        record.setCustomerPostalAddress(dto.getCustomerPostalAddress());
        record.setCustomerEmail(dto.getCustomerEmail());
        record.setCustomerCodeMain(dto.getCustomerCodeMain());
        record.setIsOrganization(dto.getIsOrganization());
        record.setIsPerson(dto.getIsPerson());
        
        record.store();
        log.info("Создан контрагент: {}", dto.getCustomerCode());
        return record;
    }
    
    @Transactional
    public CustomerRecord update(String code, CustomerDto dto) {
        CustomerRecord record = findByCode(code);
        if (record == null) {
            throw new RuntimeException("Контрагент не найден: " + code);
        }
        
        record.setCustomerName(dto.getCustomerName());
        record.setCustomerInn(dto.getCustomerInn());
        record.setCustomerKpp(dto.getCustomerKpp());
        record.setCustomerLegalAddress(dto.getCustomerLegalAddress());
        record.setCustomerPostalAddress(dto.getCustomerPostalAddress());
        record.setCustomerEmail(dto.getCustomerEmail());
        record.setCustomerCodeMain(dto.getCustomerCodeMain());
        record.setIsOrganization(dto.getIsOrganization());
        record.setIsPerson(dto.getIsPerson());
        
        record.update();
        log.info("Обновлен контрагент: {}", code);
        return record;
    }
    
    @Transactional
    public void delete(String code) {
        int deleted = dsl.deleteFrom(CUSTOMER)
                .where(CUSTOMER.CUSTOMER_CODE.eq(code))
                .execute();
        
        if (deleted == 0) {
            throw new RuntimeException("Контрагент не найден: " + code);
        }
        log.info("Удален контрагент: {}", code);
    }
    
    public List<CustomerRecord> search(String name, String inn, Boolean isOrganization) {
        Condition condition = DSL.noCondition();
        
        if (name != null && !name.isEmpty()) {
            condition = condition.and(CUSTOMER.CUSTOMER_NAME.containsIgnoreCase(name));
        }
        if (inn != null && !inn.isEmpty()) {
            condition = condition.and(CUSTOMER.CUSTOMER_INN.eq(inn));
        }
        if (isOrganization != null) {
            condition = condition.and(CUSTOMER.IS_ORGANIZATION.eq(isOrganization));
        }
        
        return dsl.selectFrom(CUSTOMER)
                .where(condition)
                .orderBy(CUSTOMER.CUSTOMER_NAME)
                .fetchInto(CustomerRecord.class);
    }
}
