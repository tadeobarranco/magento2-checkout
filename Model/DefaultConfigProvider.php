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
use Magento\Framework\App\Http\Context as HttpContext;

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
     * Class constructor
     *
     * @param \Magento\Checkout\Model\Session $checkoutSession
     */
    public function __construct(
        Session $checkoutSession,
        HttpContext $httpContext,
        CustomerRepositoryInterface $customerRepository,
        CustomerSession $customerSession,
        CustomerAddressDataProvider $customerAddressData
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->httpContext = $httpContext;
        $this->customerRepository = $customerRepository;
        $this->customerSession = $customerSession;
        $this->customerAddressData = $customerAddressData;
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
            'customerData' => $this->getCustomerData()
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
}
