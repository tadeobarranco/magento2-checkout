<?php

namespace Barranco\Checkout\Api;

use Magento\Quote\Api\Data\ShippingMethodInterface;

interface GuestShipmentEstimationInterface
{
    /**
     * Estimate shipping methods by address
     *
     * @param int $quoteId
     * @return array
     */
    public function estimateByAddress($quoteId);
}
