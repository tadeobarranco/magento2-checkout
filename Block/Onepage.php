<?php

namespace Barranco\Checkout\Block;

use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Barranco\Checkout\Model\CompositeConfigProvider;

class Onepage extends Template
{
    /**
     * @var \Magento\Framework\Serialize\Serializer\Json
     */
    private $serializer;

    /**
     * @var \Barranco\Checkout\Model\CompositeConfigProvider
     */
    private $configProvider;

    /**
     * @var array
     */
    private $layoutProcessors;

    /**
     * @var array
     */
    protected $jsLayout;

    /**
     * Class constructor
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Barranco\Checkout\Model\CompositeConfigProvider $configProvider
     * @param \Magento\Framewor\Serialize\Serializer\Json $serializer
     * @param array $layoutProcessors
     * @param array $data
     */
    public function __construct(
        Context $context,
        CompositeConfigProvider $configProvider,
        Json $serializer,
        $layoutProcessors = [],
        $data = []
    ) {
        parent::__construct($context, $data);
        $this->configProvider = $configProvider;
        $this->serializer = $serializer;
        $this->layoutProcessors = $layoutProcessors;
        $this->jsLayout = isset($data['jsLayout']) && is_array($data['jsLayout']) ? $data['jsLayout'] : [];
    }

    /**
     * Get serialized checkout configuration
     *
     * @return string
     */
    public function getSerializedCheckoutConfig()
    {
        return $this->serializer->serialize($this->getCheckoutConfig());
    }

    /**
     * Get checkout configuration
     *
     * @return array
     */
    public function getCheckoutConfig()
    {
        return $this->configProvider->getConfig();
    }

    /**
     * @inheritdoc
     */
    public function getJsLayout()
    {
        foreach ($this->layoutProcessors as $processor) {
            $this->jsLayout = $processor->process($this->jsLayout);
        }

        return $this->serializer->serialize($this->jsLayout);
    }
}