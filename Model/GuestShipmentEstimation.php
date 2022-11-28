<?php

namespace Barranco\Checkout\Model;

use Magento\Framework\Reflection\DataObjectProcessor;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Api\Data\ShippingMethodInterface;
use Magento\Quote\Model\Cart\ShippingMethodConverter;
use Magento\Quote\Model\Quote;
use Magento\Quote\Model\Quote\TotalsCollector;
use Barranco\Checkout\Api\Data\AddressInterface;
use Barranco\Checkout\Api\GuestShipmentEstimationInterface;

class GuestShipmentEstimation implements GuestShipmentEstimationInterface
{
    private CartRepositoryInterface $quoteRepository;

    private DataObjectProcessor $dataProcessor;

    private TotalsCollector $totalsCollector;

    private ShippingMethodConverter $converter;

    /**
     * Class constructor
     *
     * @param \Magento\Quote\Api\CartRepositoryInterface
     */
    public function __construct(
        CartRepositoryInterface $quoteRepository,
        DataObjectProcessor $dataProcessor,
        TotalsCollector $totalsCollector,
        ShippingMethodConverter $converter
    ) {
        $this->quoteRepository = $quoteRepository;
        $this->dataProcessor = $dataProcessor;
        $this->totalsCollector = $totalsCollector;
        $this->converter = $converter;
    }

    /**
     * @inheritdoc
     */
    public function estimateByAddress($quoteId, AddressInterface $address)
    {
        $quote = $this->quoteRepository->getActive($quoteId);

        if ($quote->isVirtual() || $quote->getItemsCount() == 0) {
            return [];
        }

        return $this->getShippingMethods($quote, $address);
    }

    /**
     * Get list of available shipping methods
     *
     * @param \Magento\Quote\Model\Quote $quote
     * @param \Barranco\Checkout\Api\Data\AddressInterface $address
     * @return ShippingMethodInterface[]
     */
    private function getShippingMethods(Quote $quote, $address)
    {
        $shippingMethods = [];
        $shippingAddress = $quote->getShippingAddress();
        $shippingAddress->addData($this->extractAddressData($address));
        $shippingAddress->setCollectShippingRates(true);

        $this->totalsCollector->collectAddressTotals($quote, $shippingAddress);

        $shippingRates = $shippingAddress->getGroupedAllShippingRates();
        $quoteCurrencyCode = $quote->getQuoteCurrencyCode();

        foreach ($shippingRates as $carrierRates) {
            foreach ($carrierRates as $rateModel) {
                $shippingMethods[] = $this->converter->modelToDataObject($rateModel, $quoteCurrencyCode);
            }
        }

        return $shippingMethods;
    }

    /**
     * Get address as an array
     *
     * @param \Barranco\Checkout\Api\Data\AddressInterface $address
     */
    private function extractAddressData($address)
    {
        return $this->dataProcessor->buildOutputDataArray($address, \Barranco\Checkout\Api\Data\AddressInterface::class);
    }
}
