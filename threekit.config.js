export default {
  credentials: {
    preview: {
      orgId: process.env.REACT_APP_THREEKIT_PREVIEW_ORG_ID,
      publicToken: process.env.REACT_APP_THREEKIT_PREVIEW_PUBLIC_TOKEN,
    },
    'admin-fts': {
      orgId: process.env.REACT_APP_THREEKIT_ADMIN_FTS_ORG_ID,
      publicToken: process.env.REACT_APP_THREEKIT_ADMIN_FTS_PUBLIC_TOKEN,
    },
  },

  products: {
    preview: {
      assetId: process.env.REACT_APP_THREEKIT_ASSET_ID,
      configurationId: undefined,
      stageId: undefined,
    },
    'admin-fts': {
      assetId: process.env.REACT_APP_THREEKIT_ASSET_ID,
      configurationId: undefined,
      stageId: undefined,
    },
  },
};
