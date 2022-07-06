<?php
/**
 * Barranco\Checkout
 */
namespace Barranco\Checkout\Model;

use Magento\Checkout\Model\ConfigProviderInterface;

class CompositeConfigProvider implements ConfigProviderInterface
{
    /**
     * @var ConfigProviderInterface[]
     */
    private $configProviders;

    /**
     * Class constructor
     *
     * @param ConfigProviderInterface[] $configProviders
     */
    public function __construct(
        array $configProviders
    ) {
        $this->configProviders = $configProviders;
    }
    
    /**
     * Get an array of checkout configuration
     *
     * @return array
     */
    public function getConfig()
    {
        $config = [];

        foreach ($this->configProviders as $configProvider) {
            $config = array_merge_recursive($config, $configProvider->getConfig());
        }

        return $config;
    }
}
