<?php
/**
 * Barranco\Checkout
 */

namespace Barranco\Checkout\Block\MyCheckout;

use Magento\Checkout\Block\Checkout\AttributeMerger;
use Magento\Checkout\Block\Checkout\LayoutProcessorInterface;
use Magento\Customer\Model\AttributeMetadataDataProvider;
use Magento\Ui\Component\Form\AttributeMapper;

class LayoutProcessor implements LayoutProcessorInterface
{
    /**
     * @var \Magento\Customer\Model\AttributeMetadataDataProvider
     */
    private $attributeMetadataDataProvider;

    /**
     * @var \Magento\Ui\Component\Form\AttributeMapper
     */
    private $attributeMapper;

    /**
     * @var \Magento\Checkout\Block\Checkout\AttributeMerger
     */
    private $attributeMerger;

    /**
     * Class constructor
     *
     * @param \Magento\Customer\Model\AttributeMetadataDataProvider $attributeMetadataDataProvider
     * @param \Magento\Ui\Component\Form\AttributeMapper $attributeMapper
     * @param \Magento\Checkout\Block\Checkout\AttributeMerger $attributeMerger
     */
    public function __construct(
        AttributeMetadataDataProvider $attributeMetadataDataProvider,
        AttributeMapper $attributeMapper,
        AttributeMerger $attributeMerger
    ) {
        $this->attributeMetadataDataProvider = $attributeMetadataDataProvider;
        $this->attributeMapper = $attributeMapper;
        $this->attributeMerger = $attributeMerger;
    }

    /**
     * @inheritdoc
     */
    public function process($jsLayout)
    {
        $elements = $this->getAddressAttributes();

        if (isset(
            $jsLayout['components']['my-checkout']['children']['steps']['children']['shipping-step']['children']
            ['shippingAddress']['children']['shipping-address-fieldset']['children']
        )) {
            $fields = $jsLayout['components']['my-checkout']['children']['steps']['children']['shipping-step']
            ['children']['shippingAddress']['children']['shipping-address-fieldset']['children'];
            $jsLayout['components']['my-checkout']['children']['steps']['children']['shipping-step']
            ['children']['shippingAddress']['children']['shipping-address-fieldset']['children'] = $this->attributeMerger->merge(
                $elements,
                'checkoutProvider',
                'shippingAddress',
                $fields
            );
        }

        return $jsLayout;
    }

    /**
     * Retrieve address attributes
     *
     * @return array
     */
    private function getAddressAttributes()
    {
        $elements = [];
        $attributes = $this->attributeMetadataDataProvider->loadAttributesCollection(
            'customer_address',
            'customer_register_address'
        );

        foreach ($attributes as $attribute) {
            
            if ($attribute->getIsUserDefined()) {
                continue;
            }

            $code = $attribute->getAttributeCode();
            $elements[$code] = $this->attributeMapper->map($attribute);

            if (isset($elements[$code]['label'])) {
                $label = $elements[$code]['label'];
                $elements[$code]['label'] = __($label);
            }

        }

        return $elements;
    }
}