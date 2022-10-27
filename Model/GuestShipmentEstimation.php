<?php

namespace Barranco\Checkout\Model;

use Barranco\Checkout\Api\GuestShipmentEstimationInterface;

class GuestShipmentEstimation implements GuestShipmentEstimationInterface
{
    /**
     * @inheritdoc
     */
    public function estimateByAddress($quoteId)
    {
        return ['quoteId' => $quoteId];
    }
}
