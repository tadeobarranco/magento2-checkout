<?php

namespace Barranco\Checkout\Api;

use Magento\Quote\Api\Data\ShippingMethodInterface;
use Barranco\Checkout\Api\Data\AddressInterface;

interface GuestShipmentEstimationInterface
{
    /**
     * Estimate shipping methods by address
     *
     * @param int $quoteId
     * @param AddressInterface $address
     * @return ShippingMethodInterface[]
     */
    public function estimateByAddress($quoteId, AddressInterface $address);
}
