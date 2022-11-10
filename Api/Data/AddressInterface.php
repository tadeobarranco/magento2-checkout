<?php

namespace Barranco\Checkout\Api\Data;

/**
 * @api
 */
interface AddressInterface
{
    const KEY_CITY = 'city';
    const KEY_COUNTRY_ID = 'country_id';
    const KEY_FIRSTNAME = 'firstname';
    const KEY_LASTNAME = 'lastname';
    const KEY_POSTCODE = 'postcode';
    const KEY_REGION = 'region';
    const KEY_REGION_ID = 'region_id';
    const KEY_STREET = 'street';
    const KEY_TELEPHONE = 'telphone';

    /**
     * Get city
     *
     * @return string
     */
    public function getCity();

    /**
     * Set city
     *
     * @param string $city
     * @return $this
     */
    public function setCity($city);

    /**
     * Get country id
     *
     * @return string
     */
    public function getCountryId();

    /**
     * Set country id
     *
     * @param string $countryId
     * @return $this
     */
    public function setCountryId($countryId);

    /**
     * Get firstname
     *
     * @return string
     */
    public function getFirstname();

    /**
     * Set firstname
     *
     * @param string $firstname
     * @return $this
     */
    public function setFirstname($firstname);

    /**
     * Get lastname
     *
     * @return string
     */
    public function getLastname();

    /**
     * Set lastname
     *
     * @param string $lastname
     * @return $this
     */
    public function setLastname($lastname);

    /**
     * Get postcode
     *
     * @return string
     */
    public function getPostcode();

    /**
     * Set postcode
     *
     * @param string $postcode
     * @return $this
     */
    public function setPostcode($postcode);

    /**
     * Get region
     *
     * @return string
     */
    public function getRegion();

    /**
     * Set region
     *
     * @param string $region
     * @return $this
     */
    public function setRegion($region);

    /**
     * Get region id
     *
     * @return int
     */
    public function getRegionId();

    /**
     * Set region id
     *
     * @param int $regionId
     * @return $this
     */
    public function setRegionId($regionId);

    /**
     * Get street
     *
     * @return string[]
     */
    public function getStreet();

    /**
     * Set street
     *
     * @param string[] $street
     * @return $this
     */
    public function setStreet($street);

    /**
     * Get telephone
     *
     * @return string
     */
    public function getTelephone();

    /**
     * Set telephone
     *
     * @param string $telephone
     * @return $this
     */
    public function setTelephone($telephone);
}
