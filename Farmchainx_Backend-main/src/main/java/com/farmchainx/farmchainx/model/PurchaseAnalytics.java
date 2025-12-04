// PurchaseAnalytics.java
package com.farmchainx.farmchainx.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PurchaseAnalytics {
    private String month;
    private Integer purchases;
    private Double revenue;
    private Double growth;

    public PurchaseAnalytics(String month, Integer purchases, Double revenue, Double growth) {
        this.month = month;
        this.purchases = purchases;
        this.revenue = revenue;
        this.growth = growth;
    }
}