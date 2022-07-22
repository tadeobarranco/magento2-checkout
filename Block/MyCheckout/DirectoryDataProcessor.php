<?php
/**
 * Barranco\Checkout
 */

namespace Barranco\Checkout\Block\MyCheckout;

use Magento\Checkout\Block\Checkout\LayoutProcessorInterface;
use Magento\Directory\Model\ResourceModel\Country\CollectionFactory;
use Magento\Store\Model\StoreManagerInterface;

class DirectoryDataProcessor implements LayoutProcessorInterface
{
    /**
     * @var array
     */
    private $countryOptions;

    /**
     * @var \Magento\Directory\Model\ResourceModel\Region\CollectionFactory
     */
    private $countryCollectionFactory;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;

    /**
     * Class constructor
     */
    public function __construct(
        CollectionFactory $countryCollectionFactory,
        StoreManagerInterface $storeManager
    ) {
        $this->countryCollectionFactory = $countryCollectionFactory;
        $this->storeManager = $storeManager;
    }

    /**
     * @inheritdoc
     */
    public function process($jsLayout)
    {
        if (!isset($jsLayout['components']['checkoutProvider']['dictionaries'])) {
            $jsLayout['components']['checkoutProvider']['dictionaries'] = [
                'country_id' => $this->getCountryOptions()
            ];
        }

        return $jsLayout;
    }

    /**
     * Retrieve country collection
     *
     * @return array
     */
    private function getCountryOptions()
    {
        if (!isset($this->countryOptions)) {
            $this->countryOptions = $this->countryCollectionFactory->create()->loadByStore(
                $this->storeManager->getStore()->getId()
            )->toOptionArray();
        }

        return $this->countryOptions;
    }
}
