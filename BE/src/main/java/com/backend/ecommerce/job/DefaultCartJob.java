package com.backend.ecommerce.job;

import com.backend.ecommerce.service.DefaultCartJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DefaultCartJob {

    @Autowired
    private DefaultCartJobService defaultCartJobService;

    @Scheduled(fixedRate = 4 * 60 * 60 * 1000)
    public void executeDefaultCartUpdate() {
        defaultCartJobService.updateDefaultCarts();
        System.out.println("Default cart job executed successfully.");
    }
}
