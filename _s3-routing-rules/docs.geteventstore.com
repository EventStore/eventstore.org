<RoutingRules>
    <RoutingRule>
        <Redirect>
            <Protocol>https</Protocol>
            <HostName>eventstore.org</HostName>
            <ReplaceKeyPrefixWith>docs/</ReplaceKeyPrefixWith>
            <HttpRedirectCode>301</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
</RoutingRules>