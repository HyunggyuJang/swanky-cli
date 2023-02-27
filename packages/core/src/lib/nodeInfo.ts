export type nodeInfo = typeof swankyNode;

export const swankyNode = {
  version: "1.1.0",
  polkadotPalletVersions: "polkadot-v0.9.37",
  supportedInk: "v4.0.0",
  downloadUrl: {
    darwin: {
      x64: "https://github.com/HyunggyuJang/swanky-node/releases/download/v1.1.0-workshop/swanky-node-v1.1.0-workshop-macOS-universal.tar.gz",
      arm64: "https://github.com/HyunggyuJang/swanky-node/releases/download/v1.1.0-workshop/swanky-node-v1.1.0-workshop-macOS-universal.tar.gz",
    },
    linux: {
      x64: "https://github.com/HyunggyuJang/swanky-node/releases/download/v1.1.0-workshop/swanky-node-v1.1.0-workshop-ubuntu-x86_64.tar.gz",
      arm64: "https://github.com/HyunggyuJang/swanky-node/releases/download/v1.1.0-workshop/swanky-node-v1.1.0-workshop-ubuntu-aarch64.tar.gz",
    },
  },
};
