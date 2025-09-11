type SnapshotOpts = {
  mimeType: string;
  size: { width: number; height: number };
};
type AttrMaps = Record<string, Record<string, any>>;
type Metadata = Record<string, any>;

const THRFETCH_ERR = 'Threekit player is not initialized';

const getEnvCfg = () => {
  const env = process.env.TRBL_THREEKIT_ENV ?? 'preview';
  const isAdmin = env === 'admin-fts';

  return {
    env,
    orgId: isAdmin
      ? process.env.THREEKIT_ADMIN_FTS_ORG_ID
      : process.env.THREEKIT_PREVIEW_ORG_ID,
    token: isAdmin
      ? process.env.THREEKIT_ADMIN_FTS_PUBLIC_TOKEN
      : process.env.THREEKIT_PREVIEW_PUBLIC_TOKEN,
  };
};

const getPlayer = () => {
  const player = window.threekit?.player;
  if (!player) throw new Error(THRFETCH_ERR);
  return player;
};

const safeFetchJSON = async (url: string) => {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
};

export const ThreekitApiService = {
  /* Camera */
  zoom(amount: number) {
    const cam = getPlayer().camera;
    cam?.zoom?.(amount);
  },

  resetCameraPosition() {
    getPlayer().camera.setPosition({
      x: 1.2827581148116816,
      y: 0.6961296782002317,
      z: 0.8691623627693661,
    });
  },

  /* Snapshots */
  async snapshot(options: SnapshotOpts) {
    return (
      getPlayer().snapshotAsync?.(options) ??
      Promise.reject(new Error('snapshotAsync unavailable'))
    );
  },

  /* Configurations */
  async saveConfiguration({ metadata }: { metadata: Metadata }) {
    const { shortId } = await (getPlayer() as any).saveConfiguration({
      metadata,
    });
    if (!shortId) throw new Error('Incorrect short id');
    return shortId;
  },

  async loadConfiguration(shortId: string) {
    const { orgId, token } = getEnvCfg();
    const url = `https://preview.threekit.com/api/configurations/${shortId}?orgId=${orgId}&bearer_token=${token}`;
    const { metadata } = await safeFetchJSON(url);
    return metadata;
  },

  /* Data tables */
  async fetchDataTable() {
    const { env, orgId, token } = getEnvCfg();
    const datatableId = '3e61e88b-3805-411a-9091-36fae1232e6b';
    const url = `https://${env}.threekit.com/api/datatables/${datatableId}/rows?orgId=${orgId}&branch=main&bearer_token=${token}&all=true`;
    return safeFetchJSON(url);
  },

  /* Pricing */
  async getPrice(selected: Metadata, attrMaps: AttrMaps = {}) {
    try {
      if (!Object.keys(attrMaps).length) {
        const attrs = (
          await getPlayer().getConfigurator()
        ).getDisplayAttributes();
        attrMaps = await this.getDynamicAttributeMaps(attrs);
      }
      const lookup: Record<string, string> = {};
      const mapByName = (name: string, extra = (v: any) => v.label) => {
        const id = selected[name]?.assetId;
        if (!id) return;
        const item = attrMaps[name]?.[id];
        if (item) lookup[name] = extra(item);
      };

      mapByName('Bottle Size', (v) =>
        v.assetId === '31251cd9-ab3f-4dff-83b1-bb64ce17caaa' ? '' : v.label
      );
      mapByName('Top');
      mapByName('Color');

      if (!lookup.Top) {
        return null;
      }

      const { rows } = await this.fetchDataTable();

      const match = rows.find((row: any) => {
        const r = row.value;

        const cupOk =
          !lookup['Bottle Size'] || r['Bottle Size'] === lookup['Bottle Size'];

        const topOk = r.Top === lookup.Top;

        const colorOk = r['Color'] === lookup['Color'];

        return cupOk && topOk && colorOk;
      });

      return match ? match.value.Price : null;
    } catch (e) {
      return null;
    }
  },

  /* Helpers */
  async getDynamicAttributeMaps(attributes: any[]) {
    return attributes.reduce<AttrMaps>((acc: AttrMaps, attr: any) => {
      acc[attr.name] = (attr.values || []).reduce(
        (m: Record<string, any>, v: any) => {
          m[v.assetId] = {
            assetId: v.assetId,
            label: v.label || v.name || '',
            ...v.metadata,
          };
          return m;
        },
        {} as Record<string, any>
      );
      return acc;
    }, {} as AttrMaps);
  },
};
