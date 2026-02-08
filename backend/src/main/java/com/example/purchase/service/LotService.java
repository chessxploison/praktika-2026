package com.example.purchase.service;

import com.example.purchase.dto.LotDto;
import com.example.purchase.jooq.tables.records.LotRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.purchase.jooq.Tables.LOT;

@Service
@RequiredArgsConstructor
@Slf4j
public class LotService {
    
    private final DSLContext dsl;
    
    public List<LotRecord> findAll() {
        return dsl.selectFrom(LOT)
                .orderBy(LOT.LOT_NAME)
                .fetchInto(LotRecord.class);
    }
    
    public LotRecord findById(Long id) {
        return dsl.selectFrom(LOT)
                .where(LOT.ID.eq(id))
                .fetchOne();
    }
    
    @Transactional
    public LotRecord create(LotDto dto) {
        LotRecord record = dsl.newRecord(LOT);
        record.setLotName(dto.getLotName());
        record.setCustomerCode(dto.getCustomerCode());
        record.setPrice(dto.getPrice());
        record.setCurrencyCode(dto.getCurrencyCode());
        record.setNdsRate(dto.getNdsRate());
        record.setPlaceDelivery(dto.getPlaceDelivery());
        record.setDateDelivery(dto.getDateDelivery());
        
        record.store();
        log.info("Создан лот: {}", dto.getLotName());
        return record;
    }
    
    @Transactional
    public LotRecord update(Long id, LotDto dto) {
        LotRecord record = findById(id);
        if (record == null) {
            throw new RuntimeException("Лот не найден: " + id);
        }
        
        record.setLotName(dto.getLotName());
        record.setCustomerCode(dto.getCustomerCode());
        record.setPrice(dto.getPrice());
        record.setCurrencyCode(dto.getCurrencyCode());
        record.setNdsRate(dto.getNdsRate());
        record.setPlaceDelivery(dto.getPlaceDelivery());
        record.setDateDelivery(dto.getDateDelivery());
        
        record.update();
        log.info("Обновлен лот ID: {}", id);
        return record;
    }
    
    @Transactional
    public void delete(Long id) {
        int deleted = dsl.deleteFrom(LOT)
                .where(LOT.ID.eq(id))
                .execute();
        
        if (deleted == 0) {
            throw new RuntimeException("Лот не найден: " + id);
        }
        log.info("Удален лот ID: {}", id);
    }
    
    public List<LotRecord> search(String lotName, String customerCode, String currencyCode) {
        Condition condition = DSL.noCondition();
        
        if (lotName != null && !lotName.isEmpty()) {
            condition = condition.and(LOT.LOT_NAME.containsIgnoreCase(lotName));
        }
        if (customerCode != null && !customerCode.isEmpty()) {
            condition = condition.and(LOT.CUSTOMER_CODE.eq(customerCode));
        }
        if (currencyCode != null && !currencyCode.isEmpty()) {
            condition = condition.and(LOT.CURRENCY_CODE.eq(currencyCode));
        }
        
        return dsl.selectFrom(LOT)
                .where(condition)
                .orderBy(LOT.LOT_NAME)
                .fetchInto(LotRecord.class);
    }
}
