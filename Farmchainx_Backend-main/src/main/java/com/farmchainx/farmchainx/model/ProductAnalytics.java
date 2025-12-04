// ProductAnalytics.java
package com.farmchainx.farmchainx.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductAnalytics {
    private String month;
    private Integer productsAdded;
    private String topCrop;
    private Integer activeListings;

    public ProductAnalytics(String month, Integer productsAdded, String topCrop, Integer activeListings) {
        this.month = month;
        this.productsAdded = productsAdded;
        this.topCrop = topCrop;
        this.activeListings = activeListings;
    }
}