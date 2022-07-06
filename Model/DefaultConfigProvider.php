<?php
/**
 * Barranco\Checkout
 */
namespace Barranco\Checkout\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Checkout\Model\Session;

class DefaultConfigProvider implements ConfigProviderInterface
{
    /**
     * @var \Magento\Checkout\Model\Session
     */
    private $checkoutSession;

    /**
     * Class constructor
     *
     * @param \Magento\Checkout\Model\Session $checkoutSession
     */
    public function __construct(
        Session $checkoutSession
    ) {
        $this->checkoutSession = $checkoutSession;
    }

    /**
     * Retrieve array of configurations
     *
     * @return array
     */
    public function getConfig()
    {
        return [
            'storeCode' => $this->getStoreCode()
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
}
