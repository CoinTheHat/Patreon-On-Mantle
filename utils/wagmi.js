import { createConfig, http } from 'wagmi';
import { mantleSepoliaTestnet } from 'wagmi/chains';
import { createClient } from 'viem';

export const config = createConfig({
    chains: [mantleSepoliaTestnet],
    client({ chain }) {
        return createClient({ chain, transport: http() });
    },
});
