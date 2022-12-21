<?php
/**
 * Barranco\Checkout
 */
namespace Barranco\Checkout\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Checkout\Model\Session;
use Magento\Customer\Api\CustomerRepositoryInterface;
use Magento\Customer\Model\Address\CustomerAddressDataProvider;
use Magento\Customer\Model\Context as CustomerContext;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Directory\Model\Country\Postcode\ConfigInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Http\Context as HttpContext;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Tax\Model\Config as TaxConfig;
use Magento\Framework\Locale\FormatInterface;

class DefaultConfigProvider implements ConfigProviderInterface
{
    /**
     * @var \Magento\Checkout\Model\Session
     */
    private $checkoutSession;

    /**
     * @var \Magento\Customer\Model\Session
     */
    private $customerSession;

    /**
     * @var \Magento\Customer\Api\CustomerRepositoryInterface
     */
    private $customerRepository;

    /**
     * @var \Magento\Framework\App\Http\Context
     */
    private $httpContext;

    /**
     * @var \Magento\Customer\Model\Address\CustomerAddressDataProvider
     */
    private $customerAddressData;

    /**
     * @var \Magento\Directory\Model\Country\Postcode\ConfigInterface
     */
    private $postcodeConfig;

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @var \Magento\Quote\Api\CartRepositoryInterface
     */
    private $quoteRepository;

    /**
     * @var \Magento\Framework\Locale\FormatInterface
     */
    private $format;

    /**
     * Class constructor
     *
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Framework\App\Http\Context $httpContext
     * @param \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository
     * @param \Magento\Customer\Model\Session $customerSession
     * @param \Magento\Customer\Model\Address\CustomerAddressDataProvider
     * @param \Magento\Directory\Model\Country\Postcode\ConfigInterface
     */
    public function __construct(
        Session $checkoutSession,
        HttpContext $httpContext,
        CustomerRepositoryInterface $customerRepository,
        CustomerSession $customerSession,
        CustomerAddressDataProvider $customerAddressData,
        ConfigInterface $postcodeConfig,
        ScopeConfigInterface $scopeConfig,
        CartRepositoryInterface $quoteRepository,
        FormatInterface $format
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->httpContext = $httpContext;
        $this->customerRepository = $customerRepository;
        $this->customerSession = $customerSession;
        $this->customerAddressData = $customerAddressData;
        $this->postcodeConfig = $postcodeConfig;
        $this->scopeConfig = $scopeConfig;
        $this->quoteRepository = $quoteRepository;
        $this->format = $format;
    }

    /**
     * Retrieve array of configurations
     *
     * @return array
     */
    public function getConfig()
    {
        return [
            'storeCode' => $this->getStoreCode(),
            'isCustomerLoggedIn' => $this->isCustomerLoggedIn(),
            'customerData' => $this->getCustomerData(),
            'postCodes' => $this->postcodeConfig->getPostCodes(),
            'defaultCountryId' => $this->getDefaultCountryId(),
            'quoteData' => $this->getQuoteData(),
            'priceFormat' => $this->getPriceFormat(),
            'basePriceFormat' => $this->getBasePriceFormat()
        ];
    }

    /**
     * Retrieve store code
     *
     * @return string
     */
    private function getStoreCode()
    {
        return $this->checkoutSession->getQuote()->getStore()->getCode();
    }

    /**
     * Retrieve customer authorization cache context
     *
     * @return bool
     */
    private function isCustomerLoggedIn()
    {
        return $this->httpContext->getValue(CustomerContext::CONTEXT_AUTH);
    }

    /**
     * Retrieve customer data
     *
     * @return array
     */
    private function getCustomerData()
    {
        $customerData = [];

        if ($this->isCustomerLoggedIn()) {
            $customer = $this->getCustomer();
            $customerData = $customer->__toArray();
            $customerData['addresses'] = $this->customerAddressData->getAddressDataByCustomer($customer);
        }

        return $customerData;
    }

    /**
     * Retrieve customer
     *
     * @return \Magento\Customer\Api\Data\CustomerInterface
     */
    private function getCustomer()
    {
        return $this->customerRepository->getById($this->customerSession->getCustomerId());
    }

    /**
     * Retrieve default country id
     *
     * @return string
     */
    private function getDefaultCountryId()
    {
        return $this->scopeConfig->getValue(
            TaxConfig::CONFIG_XML_PATH_DEFAULT_COUNTRY,
            ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Retrieve quote data
     *
     * @return array
     */
    private function getQuoteData()
    {
        $quoteData = [];

        if ($this->checkoutSession->getQuote()->getId()) {
            $quote = $this->quoteRepository->get($this->checkoutSession->getQuote()->getId());
            $quoteData = $quote->toArray();
        }

        return $quoteData;
    }

    /**
     * Retrieve price format
     *
     * @return array
     */
    private function getPriceFormat()
    {
        return $this->format->getPriceFormat(
            null,
            $this->checkoutSession->getQuote()->getQuoteCurrencyCode()
        );
    }

    /**
     * Retrieve price format
     *
     * @return array
     */
    private function getBasePriceFormat()
    {
        return $this->format->getPriceFormat(
            null,
            $this->checkoutSession->getQuote()->getBaseCurrencyCode()
        );
    }
}
