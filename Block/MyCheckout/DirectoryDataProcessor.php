<?php
/**
 * Barranco\Checkout
 */

namespace Barranco\Checkout\Block\MyCheckout;

use Magento\Checkout\Block\Checkout\LayoutProcessorInterface;
use Magento\Directory\Model\ResourceModel\Country\CollectionFactory as CountryCollectionFactory;
use Magento\Directory\Model\ResourceModel\Region\CollectionFactory as RegionCollectionFactory;
use Magento\Store\Model\StoreManagerInterface;

class DirectoryDataProcessor implements LayoutProcessorInterface
{
    /**
     * @var array
     */
    private $countryOptions;

    /**
     * @var \Magento\Directory\Model\ResourceModel\Country\CollectionFactory
     */
    private $countryCollectionFactory;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var array
     */
    private $regionOptions;

    /**
     * @var \Magento\Directory\Model\ResourceModel\Region\CollectionFactory
     */
    private $regionCollectionFactory;

    /**
     * Class constructor
     */
    public function __construct(
        CountryCollectionFactory $countryCollectionFactory,
        RegionCollectionFactory $regionCollectionFactory,
        StoreManagerInterface $storeManager
    ) {
        $this->countryCollectionFactory = $countryCollectionFactory;
        $this->regionCollectionFactory = $regionCollectionFactory;
        $this->storeManager = $storeManager;
    }

    /**
     * @inheritdoc
     */
    public function process($jsLayout)
    {
        if (!isset($jsLayout['components']['checkoutProvider']['dictionaries'])) {
            $jsLayout['components']['checkoutProvider']['dictionaries'] = [
                'country_id' => $this->getCountryOptions(),
                'region_id' => $this->getRegionOptions()
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

    /**
     * Retrieve region collection
     *
     * @return array
     */
    private function getRegionOptions()
    {
        if (!isset($this->regionOptions)) {
            $this->regionOptions = $this->regionCollectionFactory->create()->addAllowedCountriesFilter(
                $this->storeManager->getStore()->getId()
            )->toOptionArray();
        }

        return $this->regionOptions;
    }
}
