<?php

namespace Barranco\Checkout\Model;

use Barranco\Checkout\Api\Data\AddressInterface;
use Barranco\Checkout\Api\GuestShipmentEstimationInterface;

class GuestShipmentEstimation implements GuestShipmentEstimationInterface
{
    /**
     * @inheritdoc
     */
    public function estimateByAddress($quoteId, AddressInterface $address)
    {
        return ['quoteId' => $quoteId, 'address' => $address->getData()];
    }
}
