<span class="range">
    <isset name="origPrice" value="${price}" scope="page" />

    <isset name="price" value="${origPrice.min}" scope="page" />
    <isset name="isLowPrice" value="${'range-low'}" scope="page" />
    <isinclude template="/product/components/pricing/default" />
    -
    <isset name="price" value="${origPrice.max}" scope="page" />
    <isset name="isLowPrice" value="${'range-high'}" scope="page" />
    <isinclude template="/product/components/pricing/default" />
</span>
