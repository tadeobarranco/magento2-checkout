<?php
/**
 * Barranco\Checkout
 */

declare(strict_types=1);

namespace Barranco\Checkout\Controller\Index;

use Magento\Checkout\Controller\Onepage;
use Magento\Checkout\Helper\Data;
use Magento\Checkout\Model\Session;
use Magento\Customer\Api\AccountManagementInterface;
use Magento\Customer\Api\CustomerRepositoryInterface;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Controller\ResultInterface;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Controller\Result\RawFactory;
use Magento\Framework\Data\Form\FormKey\Validator;
use Magento\Framework\Registry;
use Magento\Framework\Translate\InlineInterface;
use Magento\Framework\View\LayoutFactory;
use Magento\Framework\View\Result\LayoutFactory as ResultLayoutFactory;
use Magento\Framework\View\Result\PageFactory;
use Magento\Quote\Api\CartRepositoryInterface;

class Index extends Onepage implements HttpGetActionInterface
{
    private Data $checkoutHelper;

    private Session $checkoutSession;

    public function __construct(
        AccountManagementInterface $accountManagement,
        CartRepositoryInterface $quoteRepository,
        Context $context,
        CustomerRepositoryInterface $customerRepository,
        CustomerSession $customerSession,
        Data $checkoutHelper,
        InlineInterface $translateInline,
        JsonFactory $resultJsonFactory,
        LayoutFactory $layoutFactory,
        PageFactory $resultPageFactory,
        RawFactory $resultRawFactory,
        Registry $coreRegistry,
        ResultLayoutFactory $resultLayoutFactory,
        ScopeConfigInterface $scopeConfig,
        Session $checkoutSession,
        Validator $formKeyValidator
    ) {
        $this->checkoutHelper = $checkoutHelper;
        $this->checkoutSession = $checkoutSession;
        parent::__construct(
            $context,
            $customerSession,
            $customerRepository,
            $accountManagement,
            $coreRegistry,
            $translateInline,
            $formKeyValidator,
            $scopeConfig,
            $layoutFactory,
            $quoteRepository,
            $resultPageFactory,
            $resultLayoutFactory,
            $resultRawFactory,
            $resultJsonFactory
        );
    }

    /**
     * My checkout page
     *
     * @return ResultInterface
     */
    public function execute(): ResultInterface
    {   
        if(!$this->validateCheckout()) {
            return $this->resultRedirectFactory->create()->setPath('checkout/cart');
        }

        $this->checkoutSession->setCartWasUpdated(false);
        $this->getOnepage()->initCheckout();
        $resultPage = $this->resultPageFactory->create();
        $resultPage->getConfig()->getTitle()->set(__('My Checkout'));
        
        return $resultPage;
    }

    /**
     * Validate checkout
     *
     * @return bool
     */
    private function validateCheckout(): bool
    {
        $isAllowedToCheckout = true;
        $quote = $this->getOnepage()->getQuote();

        if (!$this->checkoutHelper->canOnepageCheckout()) {
            $this->messageManager->addErrorMessage(__('One-page checkout is turned off.'));
            $isAllowedToCheckout = false;
        }

        if (!$quote->hasItems() || $quote->getHasError() || !$quote->validateMinimumAmount()) {
            $isAllowedToCheckout = false;
        }

        if (!$this->_customerSession->isLoggedIn() && !$this->checkoutHelper->isAllowedGuestCheckout($quote)) {
            $this->messageManager->addErrorMessage(__('Guest checkout is disabled.'));
            $isAllowedToCheckout = false;
        }

        return $isAllowedToCheckout;
    }
}
